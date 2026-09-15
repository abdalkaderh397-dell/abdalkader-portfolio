require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = Number(process.env.PORT || 8000);

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || ''
};

const DB_NAME =
  process.env.DB_NAME || 'abdalkader_portfolio';

let pool;

// =========================
// Middleware
// =========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'dev-only-change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

// =========================
// Database initialization
// =========================

async function initDatabase() {
  console.log('Connecting to MySQL...');

  // الاتصال بـ MySQL بدون اختيار قاعدة بيانات أولًا
  const connection =
    await mysql.createConnection(DB_CONFIG);

  // إنشاء قاعدة البيانات
  const safeDbName = DB_NAME.replace(/`/g, '');

  await connection.query(`
    CREATE DATABASE IF NOT EXISTS \`${safeDbName}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
  `);

  await connection.end();

  console.log(
    `Database "${DB_NAME}" is ready.`
  );

  // إنشاء Pool خاص بقاعدة البيانات
  pool = mysql.createPool({
    ...DB_CONFIG,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
  });

  // =========================
  // Admins table
  // =========================

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(80) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
  `);

  console.log('Table "admins" is ready.');

  // =========================
  // Feedback table
  // =========================

  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(80) NULL,
      email VARCHAR(120) NULL,
      type ENUM(
        'comment',
        'suggestion',
        'opportunity'
      ) NOT NULL DEFAULT 'comment',
      rating TINYINT UNSIGNED NOT NULL,
      message TEXT NOT NULL,
      ip_hash CHAR(64) NULL,
      created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_feedback_created_at (created_at),
      INDEX idx_feedback_rating (rating)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
  `);

  console.log('Table "feedback" is ready.');

  // =========================
  // Create admin account
  // =========================

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (username && password) {
    const [rows] = await pool.query(
      `
      SELECT id
      FROM admins
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );

    if (!rows.length) {
      const hash = await bcrypt.hash(password, 12);

      await pool.query(
        `
        INSERT INTO admins
        (username, password_hash)
        VALUES (?, ?)
        `,
        [username, hash]
      );

      console.log(
        `Admin account created: ${username}`
      );
    } else {
      console.log(
        `Admin account already exists: ${username}`
      );
    }
  }
}

// =========================
// Admin authentication
// =========================

function requireAdmin(req, res, next) {
  if (!req.session.adminId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  next();
}

// =========================
// Health check
// =========================

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      success: true,
      database: 'connected'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      database: 'disconnected'
    });
  }
});

// =========================
// Public feedback
// =========================

app.post('/api/feedback', async (req, res) => {
  try {
    const name = String(req.body.name || '')
      .trim()
      .slice(0, 80);

    const email = String(req.body.email || '')
      .trim()
      .slice(0, 120);

    const type = [
      'comment',
      'suggestion',
      'opportunity'
    ].includes(req.body.type)
      ? req.body.type
      : 'comment';

    const rating = Number(req.body.rating);

    const message = String(
      req.body.message || ''
    ).trim();

    // التحقق من التقييم
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(422).json({
        success: false,
        message: 'Invalid rating'
      });
    }

    // التحقق من الرسالة
    if (!message || message.length > 1000) {
      return res.status(422).json({
        success: false,
        message: 'Invalid message'
      });
    }

    // التحقق من البريد الإلكتروني
    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(422).json({
        success: false,
        message: 'Invalid email'
      });
    }

    // تشفير IP قبل التخزين
    const ip = req.ip || '';

    const ipHash = ip
      ? crypto
          .createHash('sha256')
          .update(ip)
          .digest('hex')
      : null;

    // حفظ التعليق
    await pool.query(
      `
      INSERT INTO feedback
      (name, email, type, rating, message, ip_hash)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name || null,
        email || null,
        type,
        rating,
        message,
        ipHash
      ]
    );

    res.json({
      success: true
    });
  } catch (error) {
    console.error(
      'Feedback error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});

// =========================
// Admin login
// =========================

app.post('/api/admin/login', async (req, res) => {
  try {
    const username = String(
      req.body.username || ''
    ).trim();

    const password = String(
      req.body.password || ''
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        password_hash
      FROM admins
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );

    if (
      !rows.length ||
      !(await bcrypt.compare(
        password,
        rows[0].password_hash
      ))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Session error'
        });
      }

      req.session.adminId = rows[0].id;
      req.session.adminUsername =
        rows[0].username;

      res.json({
        success: true
      });
    });
  } catch (error) {
    console.error(
      'Login error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});

// =========================
// Admin logout
// =========================

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({
      success: true
    });
  });
});

// =========================
// Current admin
// =========================

app.get(
  '/api/admin/me',
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      username: req.session.adminUsername
    });
  }
);

// =========================
// Get feedback
// =========================

app.get(
  '/api/admin/feedback',
  requireAdmin,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
          id,
          name,
          email,
          type,
          rating,
          message,
          created_at
        FROM feedback
        ORDER BY created_at DESC
      `);

      res.json({
        success: true,
        rows
      });
    } catch (error) {
      console.error(
        'Get feedback error:',
        error
      );

      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }
  }
);

// =========================
// Delete feedback
// =========================

app.delete(
  '/api/admin/feedback/:id',
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID'
        });
      }

      await pool.query(
        'DELETE FROM feedback WHERE id = ?',
        [id]
      );

      res.json({
        success: true
      });
    } catch (error) {
      console.error(
        'Delete feedback error:',
        error
      );

      res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }
  }
);

// =========================
// Admin static files
// =========================

app.use(
  '/admin',
  express.static(
    path.join(__dirname, 'admin')
  )
);

// =========================
// React production files
// =========================

// React is hosted on Netlify.
// Railway only serves the React files if
// dist/index.html actually exists.

const distPath = path.join(
  __dirname,
  'dist'
);

const indexFile = path.join(
  distPath,
  'index.html'
);

if (fs.existsSync(indexFile)) {
  app.use(
    express.static(distPath, {
      index: 'index.html'
    })
  );
} else {
  console.log(
    'React dist folder not found. Frontend is hosted on Netlify.'
  );
}

// =========================
// React SPA fallback
// =========================

app.get(/.*/, (req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/admin')
  ) {
    return next();
  }

  if (!fs.existsSync(indexFile)) {
    return res.status(404).json({
      success: false,
      message:
        'Frontend is hosted separately on Netlify.'
    });
  }

  res.sendFile(indexFile, (err) => {
    if (err) {
      next(err);
    }
  });
});

// =========================
// Start server
// =========================

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Portfolio backend running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      '\nCould not start the server.'
    );

    console.error(
      'Make sure MySQL is running and DB settings in .env are correct.'
    );

    console.error(
      '\nError:',
      error.message
    );

    process.exit(1);
  });