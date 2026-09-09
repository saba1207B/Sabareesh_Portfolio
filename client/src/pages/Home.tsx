/* Electric Playground: asymmetrical studio-notebook layout with cobalt, ink, and playful capability cards. */
import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUp, ArrowUpRight, Code2, ExternalLink, Menu, MoveUpRight, Smartphone, Sparkles, X } from "lucide-react";
import AntigravityCanvas from "@/components/AntigravityCanvas";
import DevTerminal from "@/components/DevTerminal";
import DynamicInstagramQR from "@/components/DynamicInstagramQR";

const projects = [
  {
    title: "Smart POS Portfolio Demo",
    category: "Web Apps",
    year: "2025",
    description: "A React and Vite point-of-sale and billing system with dual bill-counter and customer displays, barcode scanning, billing, receipts, analytics, and demo QR payments.",
    tags: ["React", "Vite", "JavaScript"],
    image: "./manus-storage/project-web_1cebb402.png",
    color: "yellow",
    art: "pos",
  },
  {
    title: "FitTrack Fitness Tracking App",
    category: "Android",
    year: "2024",
    description: "A CodeAlpha internship Android app for logging workouts, steps, calories burned, workout duration, dashboards, statistics, and offline storage.",
    tags: ["Kotlin", "Android", "Offline"],
    image: "./manus-storage/project-mobile_71b8612a.png",
    color: "mint",
    art: "mobile",
    privateLabel: "CodeAlpha internship / private repository",
  },
  {
    title: "Object Detection Tracking",
    category: "AI & Computer Vision",
    year: "2024",
    description: "A CodeAlpha internship computer-vision project using YOLO and OpenCV with bounding boxes, confidence scores, and tracking IDs.",
    tags: ["Python", "YOLO", "OpenCV"],
    image: "./manus-storage/project-3d_a3051503.png",
    color: "lilac",
    art: "vision",
    privateLabel: "CodeAlpha internship / private repository",
  },
  {
    title: "Chatbot for FAQs",
    category: "AI & Computer Vision",
    year: "2024",
    description: "A CodeAlpha internship rule-based and NLP conversational assistant for student and applicant admissions queries.",
    tags: ["Python", "NLP", "Flask"],
    image: "./manus-storage/project-ai_151909a3.png",
    color: "coral",
    art: "chatbot",
    privateLabel: "CodeAlpha internship / private repository",
  },
  {
    title: "Interactive Web Playground",
    category: "UI/UX",
    year: "2025",
    description: "Creative developer canvas experiments with kinetic motion, interactive micro-interactions, responsive grids, and design tokens.",
    tags: ["CSS", "Canvas", "UI Design"],
    image: "./manus-storage/uiux-project_905d480f.png",
    color: "sky",
    art: "uiux",
    privateLabel: "Personal exploration / live in this portfolio",
  },
];

const skills = [
  {
    number: "01",
    title: "Web Apps",
    body: "React, Vite, HTML5, CSS3, dynamic state, modular UI systems, and responsive layouts.",
    color: "yellow",
    icon: Sparkles,
    fragrance: "Citrus Zest",
    scentNote: "Fresh Vibrant Interfaces",
  },
  {
    number: "02",
    title: "UI / UX",
    body: "Figma wireframing, design systems, editorial typography, motion details, and interaction flows.",
    color: "coral",
    icon: Code2,
    fragrance: "Peach Bloom",
    scentNote: "Velvet Smooth Micro-Interactions",
  },
  {
    number: "03",
    title: "Android",
    body: "Kotlin basics, Android Studio, XML UI, modern app lifecycle, and local storage patterns.",
    color: "mint",
    icon: Smartphone,
    fragrance: "Fresh Mint",
    scentNote: "Crisp Native Performance",
  },
  {
    number: "04",
    title: "AI & Vision",
    body: "Python fundamentals, OpenCV image pipelines, YOLO object detection workflows, and applied AI tools.",
    color: "lilac",
    icon: MoveUpRight,
    fragrance: "Lavender Mist",
    scentNote: "Calm Deep Neural Models",
  },
  {
    number: "05",
    title: "Software",
    body: "Linux, Git, debugging, systems thinking, and continuous learning.",
    color: "sky",
    icon: ArrowUpRight,
    fragrance: "Cool Aqua",
    scentNote: "Pure Streamlined Logic",
  },
];

const filters = ["All", "Web Apps", "Android", "UI/UX", "AI & Computer Vision", "Software"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [typedRole, setTypedRole] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const phrase = "WEB / UI / ANDROID / AI / 3D";
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % (phrase.length + 1);
      setTypedRole(phrase.slice(0, index));
    }, 105);
    return () => window.clearInterval(timer);
  }, []);

  const visibleProjects = useMemo(
    () => filter === "All" ? projects : projects.filter((project) => project.category === filter),
    [filter],
  );

  // Scroll reveal observer: brings cards and stations to life on mobile & desktop during scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll(
      ".project-card, .sachet-hanging-station, .credential-card, .instagram-qr-card, .scroll-reveal"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleProjects]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="portfolio-shell">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Go to top" onClick={closeMenu} data-cursor="Top ✦">
          <span className="mark-bracket">[</span><span className="mark-dot" /><span className="mark-bracket">]</span>
        </a>
        <div className="header-status"><span className="status-dot" /> Creative Developer / IST</div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work" data-cursor="Work ↓">Work</a>
          <a href="#skills" data-cursor="Skills ↓">Skills</a>
          <a href="#certifications" data-cursor="Certs ↓">Certifications</a>
          <a href="#about" data-cursor="About ↓">About</a>
          <a href="#contact" data-cursor="Talk ✉">Contact</a>
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation drawer"
          aria-expanded={menuOpen}
          data-cursor={menuOpen ? "Close ✕" : "Menu ☰"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Slide-in Mobile / Off-Canvas Drawer Navigation */}
      {menuOpen && (
        <>
          <div className="drawer-overlay" onClick={closeMenu} aria-hidden="true" />
          <nav className="mobile-menu" aria-label="Mobile navigation drawer">
            <div className="drawer-header">
              <div className="drawer-status">
                <span className="status-dot" /> SABAREESH / IST
              </div>
              <button className="drawer-close-btn" onClick={closeMenu} aria-label="Close menu" data-cursor="Close ✕">
                <X size={16} />
              </button>
            </div>

            <div className="drawer-links-list">
              <a href="#work" onClick={closeMenu} className="drawer-nav-item" data-cursor="Work ↓">
                <span className="drawer-link-num">01</span>
                <span className="drawer-link-text">Selected work</span>
                <ArrowUpRight size={17} className="drawer-link-arrow" />
              </a>
              <a href="#skills" onClick={closeMenu} className="drawer-nav-item" data-cursor="Skills ↓">
                <span className="drawer-link-num">02</span>
                <span className="drawer-link-text">What I do</span>
                <ArrowUpRight size={17} className="drawer-link-arrow" />
              </a>
              <a href="#certifications" onClick={closeMenu} className="drawer-nav-item" data-cursor="Certs ↓">
                <span className="drawer-link-num">03</span>
                <span className="drawer-link-text">Certifications</span>
                <ArrowUpRight size={17} className="drawer-link-arrow" />
              </a>
              <a href="#about" onClick={closeMenu} className="drawer-nav-item" data-cursor="About ↓">
                <span className="drawer-link-num">04</span>
                <span className="drawer-link-text">About me</span>
                <ArrowUpRight size={17} className="drawer-link-arrow" />
              </a>
              <a href="#contact" onClick={closeMenu} className="drawer-nav-item" data-cursor="Talk ✉">
                <span className="drawer-link-num">05</span>
                <span className="drawer-link-text">Let&apos;s talk</span>
                <ArrowUpRight size={17} className="drawer-link-arrow" />
              </a>
            </div>

            <div className="drawer-footer-block">
              <div className="drawer-quick-links">
                <a href="https://github.com/saba1207B" target="_blank" rel="noreferrer" data-cursor="GitHub ↗">GitHub ↗</a>
                <a href="https://www.linkedin.com/in/sabareesh-m-3b488840b" target="_blank" rel="noreferrer" data-cursor="LinkedIn ↗">LinkedIn ↗</a>
                <a href="mailto:sabareesh623@gmail.com" data-cursor="Email ✉">Email ↗</a>
              </div>
              <p className="drawer-slogan">// INNOVATION NEVER ENDS</p>
            </div>
          </nav>
        </>
      )}

      <section className="hero-section" id="top">
        <AntigravityCanvas mode="blue-rainbow" showConstellationNodes={true} />
        <div className="hero-copy">
          <p className="eyebrow">Creative developer / CSE student / Tamil Nadu / IST</p>
          <div className="typewriter-line"><span>[</span>{typedRole}<span className="typewriter-caret">▌</span><span>]</span></div>
          <h1>I build the thing <span>between</span> the idea and the wow.</h1>
          <p className="hero-intro">I&apos;m SABAREESH, a first-year B.E. Computer Science and Engineering student at DACE College, Tamil Nadu. I build practical projects across web development, UI/UX, Android, AI, Linux, 3D web, and software systems.</p>
          <div className="hero-tagline"><span>[•]</span> INNOVATION NEVER ENDS</div>
          <div className="hero-actions">
            <a className="button button-dark" href="#work" data-cursor="See Work ↓">See the work <ArrowDownRight size={18} /></a>
            <a className="text-link" href="mailto:sabareesh623@gmail.com" data-cursor="Let's Talk ✉">Let&apos;s connect <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstract orbit illustration">
          <div className="hero-art-glow" aria-hidden="true" />
          <div className="orbit-label label-top">BUILD / SHAPE / SHIP</div>
          <img src="./manus-storage/orbit-hero_bc5e33b1.png" alt="Abstract cobalt orbit object" />
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <span className="orbit-note note-left">01 — MAKE IT CLEAR</span>
          <span className="orbit-note note-right">02 — MAKE IT MOVE</span>
          <div className="hero-star star-one">✦</div>
          <div className="hero-star star-two">+</div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={18} /></div>
      </section>

      <section className="ticker" aria-label="Capabilities ticker">
        <div className="ticker-track"><span>WEB APPS</span><i>✦</i><span>UI / UX</span><i>✦</i><span>ANDROID</span><i>✦</i><span>3D WEB</span><i>✦</i><span>SOFTWARE</span><i>✦</i><span>WEB APPS</span><i>✦</i></div>
      </section>

      <section className="work-section section-pad" id="work">
        <AntigravityCanvas mode="white-rainbow" />
        <div className="section-heading-row">
          <div><p className="eyebrow dark-eyebrow">Selected experiments / 2023—25</p><h2>Work<span className="outline">.</span></h2></div>
          <p className="section-note">A few things I&apos;ve designed, developed, and pushed until they felt right.</p>
        </div>
        <div className="filter-row" role="tablist" aria-label="Filter work">
          {filters.map((item) => (
            <button
              key={item}
              className={`filter-button ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
              role="tab"
              aria-selected={filter === item}
              data-cursor="Filter •"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="work-runway">
          <div className="runway-line"><span className="runway-dot" /><span className="runway-dot" /><span className="runway-dot" /></div>
          <div className="runway-label">01 — 05 / LATERAL STUDIO LOG</div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article
                className={`project-card card-${project.color}`}
                key={project.title}
                data-cursor={project.title === "Smart POS Portfolio Demo" ? "View Code ↗" : "Explore ✦"}
              >
                <AntigravityCanvas mode="dark-gold" />
                <div className={`project-visual art-${project.art || "default"}`}>
                  {project.image ? (
                    <img src={project.image} alt={`${project.title} project visual`} />
                  ) : (
                    <div className="uiux-art" aria-label="UI and UX wireframe title card">
                      <span className="wireframe-toolbar" />
                      <span className="wireframe-sidebar" />
                      <span className="wireframe-main"><i /><i /><i /><b /></span>
                      <span className="wireframe-cursor">✦</span>
                    </div>
                  )}
                  <span className="project-year">{project.year}</span>
                  <span className="project-index">[{String(index + 1).padStart(2, "0")}]</span>
                </div>
                <div className="project-meta">
                  <p className="project-category"><span className="mini-mark">[•]</span> {project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  {project.title === "Smart POS Portfolio Demo" ? (
                    <a
                      href="https://github.com/saba1207B/smart-pos-portfolio-demo"
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                      data-cursor="GitHub ↗"
                    >
                      View source code <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="project-private">{project.privateLabel}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Interactive Developer Terminal */}
        <DevTerminal />
      </section>

      <section className="skills-section section-pad" id="skills">
        <AntigravityCanvas mode="blue-rainbow" showConstellationNodes={true} />
        <div className="skills-art-glow" aria-hidden="true" />
        <div className="skills-intro">
          <p className="eyebrow">The toolkit / advanced practice</p>
          <h2>Many hats.<br /><span>One point of view.</span></h2>
          <p>I move between disciplines because the best solutions often live in the handoff between design, code, and curiosity.</p>
        </div>
        <div className="skills-hanging-wall" aria-label="Skills hanging sachets">
          {skills.map(({ number, title, body, color, icon: Icon, fragrance, scentNote }, index) => (
            <div className="sachet-hanging-station" key={title} style={{ "--sachet-index": index } as React.CSSProperties}>
              {/* Wall Pin / Thumbtack fixed to the wall */}
              <div className="sachet-wall-pin" aria-hidden="true">
                <div className="pin-shadow" />
                <div className="pin-shaft" />
                <div className="pin-head">
                  <div className="pin-glint" />
                </div>
              </div>

              {/* Hanging Cord / Thread connecting wall pin to the pouch */}
              <div className="sachet-thread" aria-hidden="true">
                <div className="thread-twine" />
              </div>

              {/* Fragrance Sachet Pouch (Reacts to hover with swinging and press with downward tug) */}
              <article
                className={`sachet-card sachet-${color}`}
                data-cursor="Tug Sachet ✦"
                tabIndex={0}
                role="region"
                aria-label={`${title} fragrance sachet`}
              >
                {/* Top Punched Grommet / Eyelet */}
                <div className="sachet-eyelet-header" aria-hidden="true">
                  <div className="sachet-eyelet">
                    <span className="eyelet-metal" />
                    <span className="eyelet-hole" />
                  </div>
                </div>

                {/* Perforated Zipper Tear Strip */}
                <div className="sachet-zipper-strip" aria-hidden="true">
                  <span className="zipper-notch notch-left" />
                  <div className="zipper-line">
                    <span className="zipper-tag">ODONIL ZIPPER • GODREJ AER STYLE</span>
                    <span className="zipper-pull-text">PULL ▾</span>
                  </div>
                  <span className="zipper-notch notch-right" />
                </div>

                {/* Sachet Content */}
                <div className="sachet-body-inner">
                  <div className="sachet-top-meta">
                    <span className="sachet-number">[{number}]</span>
                    <span className="sachet-scent-badge">
                      <span className="scent-indicator" />
                      {fragrance}
                    </span>
                    <Icon size={24} className="sachet-icon" />
                  </div>

                  <h3 className="sachet-title">{title}</h3>
                  <p className="sachet-description">{body}</p>

                  <div className="sachet-aroma-row" aria-hidden="true">
                    <span className="aroma-waves">~ ~ ~</span>
                    <span className="aroma-note">{scentNote}</span>
                  </div>

                  <div className="sachet-foot">
                    <span className="sachet-hint">HOVER TO SWING • PULL TO TUG</span>
                    <span className="sachet-arrow"><ArrowUpRight size={20} /></span>
                  </div>
                </div>

                {/* Heat-sealed crimped bottom edge */}
                <div className="sachet-bottom-seal" aria-hidden="true">
                  <div className="crimp-pattern" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="credentials-section section-pad" id="certifications">
        <AntigravityCanvas mode="white-rainbow" />
        <div className="section-heading-row"><div><p className="eyebrow dark-eyebrow">Learning never stops</p><h2>Proof of<br /><span className="outline">practice.</span></h2></div><p className="section-note">Courses and workshops that keep the toolkit growing.</p></div>
        <div className="credential-grid"><article className="credential-card credential-guvi"><span className="credential-corner">[•]</span><span className="credential-mark">GUVI / HCL</span><p className="credential-type">Certificate of completion</p><h3>Cloud AI in 90 Minutes Productivity Course</h3><p>Build Your AI Work Assistant</p><span className="credential-foot">Issued September 2026</span></article><article className="credential-card credential-be10x"><span className="credential-corner">[•]</span><span className="credential-mark">BE10X</span><p className="credential-type">Workshop</p><h3>AI Tools Workshop</h3><p>Practical exploration of modern AI tools and workflows.</p><span className="credential-foot">Learning in public</span></article></div>
      </section>

      <section className="about-section section-pad" id="about">
        <AntigravityCanvas mode="white-rainbow" />
        <div className="about-stamp"><span className="stamp-mark">[•]</span>A LITTLE<br />ABOUT ME<span className="stamp-coordinate">X 04 / Y 01</span></div>
        <div className="about-copy"><p className="eyebrow dark-eyebrow">Behind the screens</p><h2>Curious by default.<br /><em>Useful on purpose.</em></h2><p>I&apos;m a Computer Science &amp; Engineering student passionate about technology, software development, AI, and building real-world projects.</p><p>I enjoy exploring Android development, web development, Linux, and emerging technologies while continuously learning and improving my skills. I&apos;m focused on turning ideas into practical projects and building a strong future in the tech industry.</p><div className="about-facts"><div><strong>01</strong><span>first-year CSE</span></div><div><strong>IST</strong><span>India timezone</span></div><div><strong>∞</strong><span>innovation never ends</span></div></div></div>
        <DynamicInstagramQR />
      </section>

      <footer className="footer-section section-pad" id="contact">
        <AntigravityCanvas mode="dark-gold" />
        <div className="footer-kicker">Innovation never ends</div><h2>Let&apos;s give it<br /><span>somewhere to go.</span></h2><a className="button button-light" href="mailto:sabareesh623@gmail.com">Email SABAREESH <ArrowUpRight size={19} /></a><div className="footer-bottom"><span>© 2026 — Built by SABAREESH.</span><div className="footer-links"><a href="https://github.com/saba1207B" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/sabareesh-m-3b488840b" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:sabareesh623@gmail.com">Email</a></div><span className="footer-code">// innovation never ends</span></div>
      </footer>

      {/* Floating Scroll to Top Button (Only element that follows when scrolling) */}
      <button
        className={`scroll-to-top-button ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        data-cursor="Top ↑"
        title="Back to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} color="#ffffff" />
      </button>
    </main>
  );
}
