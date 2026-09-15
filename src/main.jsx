import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
const API_BASE = import.meta.env.VITE_API_URL || '';
const photos = [
  '/images/profile-1.jpg',
  '/images/profile-2.jpg',
  '/images/profile-3.jpg'
];

const journey = [
  {
    icon: '📍',
    mark: '1999',
    title: {
      ar: 'ولدت في الرقة',
      en: 'Born in Raqqa'
    },
    detail: {
      ar: 'ولدت في مدينة الرقة عام 1999.',
      en: 'I was born in Raqqa in 1999.'
    }
  },
  {
    icon: '🎓',
    mark: '01',
    title: {
      ar: 'هندسة المعلوماتية',
      en: 'Information Engineering'
    },
    detail: {
      ar: 'حصلت على إجازة في الهندسة المعلوماتية من جامعة الحواش الخاصة.',
      en: 'I earned a degree in Information Engineering from Al-Hawash Private University.'
    }
  },
  {
    icon: '💼',
    mark: '2022–23',
    title: {
      ar: 'أخصائي تكنولوجيا معلومات',
      en: 'IT Specialist'
    },
    detail: {
      ar: 'عملت أخصائي تكنولوجيا معلومات في مركز دلتا لخدمات المعلومات من يونيو 2022 إلى مارس 2023.',
      en: 'I worked as an IT Specialist at Delta IT Services Center from June 2022 to March 2023.'
    }
  },
  {
    icon: '💻',
    mark: '02',
    title: {
      ar: 'مشاريعي التقنية',
      en: 'My Technical Projects'
    },
    detail: {
      ar: 'أنجزت مشروع النادي الرياضي، ثم مشروع التخرج: نظام إدارة المشاريع.',
      en: 'I completed the Sports Club project, followed by my graduation project: Project Management System.'
    }
  },
  {
    icon: '🚀',
    mark: 'NOW',
    title: {
      ar: 'أطور مهاراتي وأبحث عن فرص جديدة',
      en: 'Growing and seeking new opportunities'
    },
    detail: {
      ar: 'أطور مهاراتي وأبحث عن فرص جديدة أستطيع من خلالها تقديم قيمة حقيقية.',
      en: 'I keep developing my skills and seek new opportunities where I can create real value.'
    }
  }
];

const projects = {
  club: {
    type: {
      ar: 'مشروع أكاديمي',
      en: 'Academic Project'
    },
    title: {
      ar: '🏋️ مشروع النادي الرياضي',
      en: '🏋️ Sports Club Project'
    },
    image: photos[1],
    body: {
      ar: [
        'نظام ويب لإدارة النادي والمستخدمين والحجوزات والخدمات.',
        'أهم الميزات:',
        'إدارة المستخدمين والأدوار.',
        'تنظيم الحجوزات والجلسات.',
        'إدارة الخدمات والمعلومات.',
        'واجهات متجاوبة.',
        'التقنيات: HTML, CSS, JavaScript, SQL.',
        'دوري: تحليل المتطلبات، تصميم الواجهات وقاعدة البيانات والمساهمة في التطوير.'
      ],
      en: [
        'A web system for managing the club, users, bookings and services.',
        'Key features:',
        'User and role management.',
        'Booking and session organization.',
        'Service management.',
        'Responsive interfaces.',
        'Technologies: HTML, CSS, JavaScript, SQL.',
        'My role: Requirements analysis, interface and database design, and development contribution.'
      ]
    }
  },

  pms: {
    type: {
      ar: 'مشروع التخرج',
      en: 'Graduation Project'
    },
    title: {
      ar: '💻 نظام إدارة المشاريع',
      en: '💻 Project Management System'
    },
    image: photos[2],
    body: {
      ar: [
        'نظام لإدارة المشاريع والمهام وأعضاء الفريق ومتابعة سير العمل.',
        'أهم الميزات:',
        'إدارة المشاريع والمهام.',
        'إدارة أعضاء الفريق والصلاحيات.',
        'متابعة الحالة وسير العمل.',
        'تصميم UML وERD وقاعدة بيانات منظمة.',
        'التقنيات والمفاهيم: Web, SQL, UML, ERD وUI.',
        'دوري: تحليل النظام وتصميم قواعد البيانات والواجهات والمساهمة في التنفيذ.'
      ],
      en: [
        'A system for managing projects, tasks, team members and workflow.',
        'Key features:',
        'Project and task management.',
        'Team members and permissions.',
        'Workflow tracking.',
        'UML, ERD and structured database design.',
        'Technologies & concepts: Web, SQL, UML, ERD and UI.',
        'My role: System analysis, database and interface design, and implementation contribution.'
      ]
    }
  }
};

const T = ({ ar, en }) => (
  <>
    {ar && en
      ? document.documentElement.lang === 'ar'
        ? ar
        : en
      : null}
  </>
);

function App() {
  const [lang, setLang] = useState('ar');
 const [light, setLight] = useState(true);
  const [menu, setMenu] = useState(false);
  const [photo, setPhoto] = useState(photos[0]);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('');
  const [counts, setCounts] = useState({
    projects: 0,
    experience: 0,
    tech: 0
  });

  const tr = (ar, en) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.body.classList.toggle('light', light);

    document.title = tr(
      'عبد القادر أحمد الحمود | مهندس معلوماتية',
      'Abdalkader Ahmad Al-Hamoud | Information Engineer'
    );
  }, [lang, light]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es =>
        es.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        }),
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(e => obs.observe(e));

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;

      const progress = document.querySelector('.scroll-progress');

      if (progress) {
        progress.style.width = max
          ? `${(h.scrollTop / max) * 100}%`
          : '0%';
      }
    };

    addEventListener('scroll', onScroll);

    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => {
        if (!es[0].isIntersecting) return;

        const targets = [
          ['projects', 2],
          ['experience', 1],
          ['tech', 5]
        ];

        targets.forEach(([key, target]) => {
          let n = 0;

          const id = setInterval(() => {
            n++;

            setCounts(c => ({
              ...c,
              [key]: n
            }));

            if (n >= target) {
              clearInterval(id);
            }
          }, 120);
        });

        obs.disconnect();
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById('stats');

    if (el) {
      obs.observe(el);
    }

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => {
        if (es[0].isIntersecting) {
          document
            .querySelectorAll('.skill i')
            .forEach(x => {
              x.style.width = x.dataset.width;
            });

          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const el = document.getElementById('skills');

    if (el) {
      obs.observe(el);
    }

    return () => obs.disconnect();
  }, []);

  /*
    =====================================================
    إرسال التعليقات والتقييم
    تم تغيير FormData إلى JSON حتى يتوافق
    مع express.json() الموجود في server.cjs
    =====================================================
  */

  async function submitFeedback(e) {
    e.preventDefault();

    const form = e.currentTarget;

    if (!rating) {
      setStatus(
        tr(
          'يرجى اختيار مستوى التقييم أولًا.',
          'Please choose a rating first.'
        )
      );

      return;
    }

    const fd = new FormData(form);

    fd.set('rating', String(rating));

    const payload = Object.fromEntries(fd.entries());

    setStatus(
      tr(
        'جاري إرسال رسالتك...',
        'Sending your feedback...'
      )
    );

   try {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },

    body: JSON.stringify(payload)
  });

  const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to send feedback'
        );
      }

      setStatus(
        tr(
          'تم إرسال رأيك بنجاح وبشكل خاص. شكرًا لك ❤️',
          'Your feedback was sent privately. Thank you ❤️'
        )
      );

      form.reset();

      setRating(0);
    } catch (error) {
      console.error(
        'Feedback submission error:',
        error
      );

      setStatus(
        tr(
          'تعذر إرسال الرسالة الآن. حاول مرة أخرى.',
          'Could not send now. Please try again.'
        )
      );
    }
  }

  return (
    <>
      <div className="scroll-progress" />
      <div className="tech-bg" />

      <header>
        <a className="logo" href="#home">
          A<span>H</span>
        </a>

        <nav className={menu ? 'open' : ''}>
          {[
            ['#home', 'الرئيسية', 'Home'],
            ['#about', 'من أنا', 'About'],
            ['#journey', 'رحلتي', 'Journey'],
            ['#skills', 'مهاراتي', 'Skills'],
            ['#projects', 'المشاريع', 'Projects'],
            ['#contact', 'تواصل معي', 'Contact'],
            ['#feedback', 'رأيك يهمني', 'Your Feedback']
          ].map(([href, ar, en]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenu(false)}
            >
              {tr(ar, en)}
            </a>
          ))}
        </nav>

        <div className="tools">
          <button
            onClick={() => setLight(v => !v)}
            aria-label="theme"
          >
            {light ? '☾' : '☀'}
          </button>

          <button
            className="language-toggle"
            onClick={() =>
              setLang(v => (v === 'ar' ? 'en' : 'ar'))
            }
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          <button
            onClick={() => setMenu(v => !v)}
          >
            ☰
          </button>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="hero section"
        >
          <div className="hero-copy reveal">
            <p className="accent">
              {tr('👋 مرحبًا، أنا', "👋 Hello, I'm")}
            </p>

            <h1
              style={{
                fontSize: 'clamp(34px, 4.5vw, 56px)',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {tr(
                'عبد القادر أحمد الحمود',
                'Abdalkader Ahmad Al-Hamoud'
              )}
            </h1>
            <h2>
              {tr(
                'مهندس معلوماتية',
                'Information Engineer'
              )}
            </h2>

            <p className="lead">
              {tr(
                'أحوّل الأفكار إلى حلول تقنية عملية، مع اهتمام بتطوير الويب وتحليل البيانات وقواعد البيانات وحل المشكلات التقنية.',
                'I turn ideas into practical technical solutions, with a focus on web development, data analysis, databases and technical problem solving.'
              )}
            </p>

            <div className="buttons">
              <a
                className="btn primary"
                href="#projects"
              >
                {tr(
                  'استكشف مشاريعي',
                  'Explore My Projects'
                )}
              </a>

              <a
                className="btn"
                href="#contact"
              >
                {tr(
                  'لنبدأ مشروعًا معًا',
                  "Let's Start a Project"
                )}
              </a>

              <a
                className="btn"
                href="/cv.pdf"
                download
              >
                📄 {tr(
                  'تحميل CV',
                  'Download CV'
                )}
              </a>
            </div>

            <div className="quick">
              📍 {tr(
                'الرقة، سوريا',
                'Raqqa, Syria'
              )}
              &nbsp; • &nbsp;
              🎓 {tr(
                'هندسة المعلوماتية',
                'Information Engineering'
              )}
            </div>
          </div>

          <div className="portrait reveal">
            <div className="glow" />

            <div className="photo">
              <img
                src={photo}
                alt="عبد القادر"
              />
            </div>

            <div className="gallery">
              {photos.map((p, i) => (
                <button
                  key={p}
                  className={
                    photo === p ? 'active' : ''
                  }
                  onClick={() => setPhoto(p)}
                >
                  <img
                    src={p}
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section"
        >
          <div className="heading">
            <small>01</small>

            <h2>
              {tr(
                'من أنا',
                'About Me'
              )}
            </h2>
          </div>

          <div className="two reveal">
            <div>
              <p>
                {tr(
                  'أنا عبد القادر أحمد الحمود، مهندس معلوماتية من الرقة. حصلت على إجازة في الهندسة المعلوماتية من جامعة الحواش الخاصة، ولدي خبرة في تكنولوجيا المعلومات والدعم الفني وإدارة البيانات وقواعد البيانات، إلى جانب اهتمام بتطوير البرمجيات وتقنيات الويب.',
                  'I am Abdalkader Ahmad Al-Hamoud, an Information Engineer from Raqqa. I hold a degree in Information Engineering from Al-Hawash Private University, with experience in information technology, technical support, data management and databases, alongside an interest in software development and web technologies.'
                )}
              </p>

              <p>
                {tr(
                  'أعمل على تطوير مهاراتي باستمرار، وأستمتع بتحليل المشكلات وتحويلها إلى حلول تقنية واضحة وعملية.',
                  'I continuously develop my skills and enjoy analyzing problems and turning them into clear, practical technical solutions.'
                )}
              </p>
            </div>

            <div className="card">
              <h3>
                {tr(
                  'معلومات شخصية',
                  'Personal Information'
                )}
              </h3>

              <div>
                <span>
                  {tr(
                    'تاريخ الميلاد',
                    'Date of Birth'
                  )}
                </span>

                <b>18 / 01 / 1999</b>
              </div>

              <div>
                <span>
                  {tr(
                    'مكان الميلاد',
                    'Place of Birth'
                  )}
                </span>

                <b>
                  {tr(
                    'الرقة',
                    'Raqqa'
                  )}
                </b>
              </div>

              <div>
                <span>
                  {tr(
                    'السكن',
                    'Residence'
                  )}
                </span>

                <b>
                  {tr(
                    'الرقة – المشلب',
                    'Al-Mashlab, Raqqa'
                  )}
                </b>
              </div>

              <div>
                <span>
                  {tr(
                    'التخصص',
                    'Specialization'
                  )}
                </span>

                <b>
                  {tr(
                    'هندسة المعلوماتية',
                    'Information Engineering'
                  )}
                </b>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="heading">
            <small>02</small>

            <h2>
              {tr(
                'ماذا أستطيع أن أقدم؟',
                'What I Can Offer'
              )}
            </h2>
          </div>

          <div className="services">
            {[
              [
                '⌁',
                'تحليل البيانات',
                'Data Analysis',
                'تنظيم وتحليل البيانات واستخراج المعلومات المفيدة.',
                'Organizing and analyzing data to extract useful information.'
              ],
              [
                '⌘',
                'تطوير مواقع الويب',
                'Web Development',
                'واجهات حديثة ومتجاوبة وسهلة الاستخدام.',
                'Modern, responsive and user-friendly interfaces.'
              ],
              [
                '▣',
                'قواعد البيانات',
                'Database Design',
                'تصميم وإدارة قواعد البيانات باستخدام SQL وMySQL.',
                'Designing and managing databases using SQL and MySQL.'
              ],
              [
                '⚙',
                'الدعم الفني',
                'Technical Support',
                'تشخيص الأعطال وحل المشكلات التقنية.',
                'Troubleshooting and solving technical issues.'
              ],
              [
                '✦',
                'حل المشكلات',
                'Problem Solving',
                'تحليل المشكلة وبناء حل منظم وعملي.',
                'Analyzing problems and building organized, practical solutions.'
              ]
            ].map(
              ([icon, ar, en, par, pen]) => (
                <article
                  className="service reveal"
                  key={en}
                >
                  {icon}

                  <h3>
                    {tr(ar, en)}
                  </h3>

                  <p>
                    {tr(par, pen)}
                  </p>
                </article>
              )
            )}
          </div>
        </section>

        <section
          className="stats section"
          id="stats"
        >
          <div>
            <b>{counts.projects}</b>
            <span>
              {tr(
                '+ مشاريع',
                '+ Projects'
              )}
            </span>
          </div>

          <div>
            <b>{counts.experience}</b>
            <span>
              {tr(
                ' خبرة عملية',
                ' Work Experience'
              )}
            </span>
          </div>

          <div>
            <b>{counts.tech}</b>
            <span>
              {tr(
                '+ تقنيات برمجية',
                '+ Technologies'
              )}
            </span>
          </div>

          <div>
            <b>∞</b>

            <span>
              {tr(
                ' شغف بالتعلم',
                ' Passion for Learning'
              )}
            </span>
          </div>
        </section>

        <section
          id="journey"
          className="section"
        >
          <div className="heading">
            <small>03</small>

            <h2>
              My Journey |{' '}
              <span>
                {tr(
                  'رحلتي',
                  'My Journey'
                )}
              </span>
            </h2>
          </div>

          <div className="timeline">
            {journey.map((x, i) => (
              <button
                className={`time ${
                  journeyIndex === i
                    ? 'active'
                    : ''
                }`}
                key={x.mark}
                onClick={() =>
                  setJourneyIndex(i)
                }
              >
                <i>{x.mark}</i>

                <span>{x.icon}</span>

                <b>
                  {x.title[lang]}
                </b>
              </button>
            ))}
          </div>

          <div className="journey-detail">
            <h3>
              {journey[journeyIndex].title[lang]}
            </h3>

            <p>
              {journey[journeyIndex].detail[lang]}
            </p>
          </div>
        </section>

        <section
          id="skills"
          className="section"
        >
          <div className="heading">
            <small>04</small>

            <h2>
              {tr(
                'مهاراتي',
                'My Skills'
              )}
            </h2>
          </div>

          <div className="skills">
            {[
              ['HTML', '90%'],
              ['CSS', '85%'],
              ['JavaScript', '80%'],
              ['SQL', '85%'],
              ['Python', '70%'],
              ['React', '70%'],
              ['JSX', '80%'],
              ['Node.js', '75%'],
              ['MySQL', '80%'],
               ['Express.js', '75%'], 
            ].map(([name, p]) => (
              <div
                className="skill"
                key={name}
              >
                <b>
                  {name}
                  <span>{p}</span>
                </b>

                <i data-width={p} />
              </div>
            ))}
          </div>

        </section>

        <section
          id="projects"
          className="section"
        >
          <div className="heading">
            <small>05</small>

            <h2>
              {tr(
                'مشاريعي',
                'My Projects'
              )}
            </h2>
          </div>

          <div className="projects">
            {[
              ['club', projects.club],
              ['pms', projects.pms]
            ].map(([key, p]) => (
              <article
                className={`project ${
                  key === 'pms'
                    ? 'featured'
                    : ''
                } reveal`}
                key={key}
              >
                <img
                  src={p.image}
                  alt=""
                />

                <div>
                  <small>
                    {p.type[lang]}
                  </small>

                  <h3>
                    {p.title[lang]}
                  </h3>

                  <p>
                    {p.body[lang][0]}
                  </p>

                  <div className="tags">
                    {(key === 'club'
                      ? [
                          'HTML',
                          'CSS',
                          'JavaScript',
                          'SQL'
                        ]
                      : [
                          'Web',
                          'SQL',
                          'UML',
                          'ERD'
                        ]
                    ).map(t => (
                      <span key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    className="details"
                    onClick={() =>
                      setModal(p)
                    }
                  >
                    {tr(
                      'عرض المشروع',
                      'View Project'
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="heading">
            <small>06</small>

            <h2>
              {tr(
                'اللغات',
                'Languages'
              )}
            </h2>
          </div>

          <div className="langs">
            <div>
              <b>
                {tr(
                  'العربية',
                  'Arabic'
                )}
              </b>

              <span>
                {tr(
                  'اللغة الأم',
                  'Native'
                )}
              </span>
            </div>

            <div>
              <b>
                {tr(
                  'الإنجليزية',
                  'English'
                )}
              </b>

              <span>
                {tr(
                  'جيد',
                  'Good'
                )}
              </span>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section"
        >
          <div className="contact reveal">
            <div>
              <div>
                <small className="accent">
                  {tr(
                    'لنبقَ على تواصل',
                    "Let's connect"
                  )}
                </small>

                <h2>
                  {tr(
                    'هل لديك فرصة أو مشروع؟',
                    'Have an opportunity or project?'
                  )}
                </h2>

                <p>
                  {tr(
                    'يسعدني التواصل معك ومناقشة فرص العمل أو المشاريع التقنية والتعاون.',
                    'I would be happy to connect and discuss job opportunities, technical projects or collaboration.'
                  )}
                </p>
              </div>

              <div className="contact-links">
                <a href="mailto:abdalkaderh397@gmail.com">
                  📧 abdalkaderh397@gmail.com
                </a>

                <a
                  href="https://wa.me/963935108455"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon whatsapp-icon" aria-hidden="true">
                    ◉
                  </span>
                  0935108455
                </a>

                <a
                  href="https://wa.me/963948346355"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon whatsapp-icon" aria-hidden="true">
                    ◉
                  </span>
                  0948346355
                </a>

                <a
                  href="https://www.facebook.com/share/1DinMPacHk/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon facebook-icon" aria-hidden="true">
                    f
                  </span>
                  Facebook
                </a>

                <a
                  href="https://www.instagram.com/eng_abdalkader?stkn=MWpoNHZmencxYnFpZQ=="
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon instagram-icon" aria-hidden="true">
                    ◎
                  </span>
                  Instagram
                </a>

              </div>
            </div>
          </div>
        </section>

        <section
          id="feedback"
          className="section feedback-section"
        >
          <div className="heading">
            <small>07</small>

            <h2>
              {tr(
                'رأيك واقتراحك يهمني',
                'Your Feedback Matters'
              )}
            </h2>
          </div>

          <div className="feedback-grid">
            <div className="feedback-copy reveal">
              <small className="accent">
                {tr(
                  'تواصل خاص',
                  'Private Feedback'
                )}
              </small>

              <h2>
                {tr(
                  'ساعدني على تطوير الموقع 🚀',
                  'Help me improve the website 🚀'
                )}
              </h2>

              <p>
                {tr(
                  'يمكنك إرسال رأيك أو اقتراحك مباشرة. الرسالة لا تظهر للزوار الآخرين، وتصل إلى صاحب الموقع فقط.',
                  'Send your feedback or suggestion directly. It is not displayed to other visitors and is accessible only to the site owner.'
                )}
              </p>

              <div className="privacy-note">
                🔒{' '}
                {tr(
                  'ملاحظات الزوار خاصة ولا يتم عرضها على الموقع.',
                  'Visitor feedback is private and is not displayed publicly.'
                )}
              </div>
            </div>

            <form
              className="feedback-form reveal"
              onSubmit={submitFeedback}
            >
              <label>
                <span>
                  {tr(
                    'الاسم (اختياري)',
                    'Name (optional)'
                  )}
                </span>

                <input
                  name="name"
                  maxLength="80"
                  placeholder={tr(
                    'اسمك',
                    'Your name'
                  )}
                />
              </label>

              <label>
                <span>
                  {tr(
                    'البريد الإلكتروني (اختياري)',
                    'Email (optional)'
                  )}
                </span>

                <input
                  name="email"
                  type="email"
                  maxLength="120"
                  placeholder="example@email.com"
                />
              </label>

              <label>
                <span>
                  {tr(
                    'نوع الرسالة',
                    'Message Type'
                  )}
                </span>

                <select name="type">
                  <option value="comment">
                    {tr(
                      'تعليق',
                      'Comment'
                    )}
                  </option>

                  <option value="suggestion">
                    {tr(
                      'اقتراح',
                      'Suggestion'
                    )}
                  </option>

                  <option value="opportunity">
                    {tr(
                      'فرصة عمل',
                      'Job Opportunity'
                    )}
                  </option>
                </select>
              </label>

              <label>
                <span>
                  {tr(
                    'كيف تقيّم تجربتك؟',
                    'How would you rate your experience?'
                  )}
                </span>

                <input
                  type="hidden"
                  name="rating"
                  value={rating}
                />

                <div className="emoji-rating">
                  {[
                    [
                      '😞',
                      'غير راضٍ',
                      'Not satisfied'
                    ],
                    [
                      '😕',
                      'يحتاج تحسين',
                      'Needs improvement'
                    ],
                    [
                      '😐',
                      'جيد',
                      'Good'
                    ],
                    [
                      '😊',
                      'جيد جدًا',
                      'Very good'
                    ],
                    [
                      '🤩',
                      'ممتاز',
                      'Excellent'
                    ]
                  ].map(
                    ([emoji, ar, en], i) => (
                      <button
                        type="button"
                        className={`emoji-option ${
                          rating === i + 1
                            ? 'active'
                            : ''
                        }`}
                        key={i}
                        onClick={() =>
                          setRating(i + 1)
                        }
                      >
                        <span>
                          {emoji}
                        </span>

                        <small>
                          {tr(ar, en)}
                        </small>
                      </button>
                    )
                  )}
                </div>
              </label>

              <label>
                <span>
                  {tr(
                    'التعليق أو الاقتراح',
                    'Comment or Suggestion'
                  )}
                </span>

                <textarea
                  name="message"
                  rows="5"
                  maxLength="1000"
                  required
                  placeholder={tr(
                    'اكتب رسالتك هنا...',
                    'Write your comment or suggestion here...'
                  )}
                />
              </label>

              <button
                className="btn primary"
                type="submit"
              >
                {tr(
                  '📤 إرسال بشكل خاص',
                  '📤 Send Privately'
                )}
              </button>

              <p className="form-status">
                {status}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} عبد القادر أحمد الحمود ·{' '}
        {tr(
          'جميع الحقوق محفوظة',
          'All rights reserved'
        )}
      </footer>

      {modal && (
        <div
          className="modal open"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}
        >
          <div className="modal-box">
            <button
              onClick={() => setModal(null)}
            >
              ×
            </button>

            <img
              src={modal.image}
              alt=""
            />

            <div className="modal-body">
              <small>
                {modal.type[lang]}
              </small>

              <h2>
                {modal.title[lang]}
              </h2>

              {modal.body[lang].map(
                (line, i) =>
                  i === 1 ||
                  line.endsWith(':') ? (
                    <p key={i}>
                      <b>{line}</b>
                    </p>
                  ) : (
                    <p key={i}>
                      {line}
                    </p>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

createRoot(
  document.getElementById('root')
).render(
  <App />
);