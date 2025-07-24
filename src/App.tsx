import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const pages = [
  { id: 'about', name: 'About', icon: '👨‍💻', color: '#00d068' },           // Emerald Green
  { id: 'education', name: 'Education', icon: '🎓', color: '#007cf0' },     // Electric Blue  
  { id: 'work', name: 'Work Experience', icon: '💼', color: '#7f00ff' },   // Purple Accent
  { id: 'projects', name: 'Projects', icon: '🚀', color: '#00ffff' },      // Cyan
  { id: 'resume', name: 'Resume', icon: '📄', color: '#ff6b35' },          // Orange
  { id: 'blogs', name: 'Blogs', icon: '📝', color: '#ec008c' },            // Pink/Hot Pink
  { id: 'research', name: 'Research', icon: '🔬', color: '#ffa040' },      // Coral Red
  { id: 'contact', name: 'Contact', icon: '📞', color: '#1484cd' }         // Deep Blue
];

// Simple Dark/Light Mode Toggle
function ModeToggle({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean; setIsDarkMode: (mode: boolean) => void }) {
  return (
    <button
      className="mode-toggle-btn glass-btn"
      onClick={() => setIsDarkMode(!isDarkMode)}
      title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
    >
      <span className="mode-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
} function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('about');
  const [toggleBottom, setToggleBottom] = useState(40); // px from bottom
  const footerRef = useRef<HTMLDivElement | null>(null);

  // Page to theme mapping based on exact colors
  const pageThemeMap: { [key: string]: string } = {
    'about': 'emerald',
    'education': 'electric-blue',
    'work': 'purple',
    'projects': 'cyan',
    'resume': 'orange',
    'blogs': 'pink',
    'research': 'coral',
    'contact': 'deep-blue'
  };

  // Get current theme based on page and mode
  const currentTheme = `${pageThemeMap[currentPage]}-${isDarkMode ? 'dark' : 'light'}`;
  const currentPageData = pages.find(p => p.id === currentPage);

  // Dynamically position toggle above footer background
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const defaultBottom = 40; // px
      const gap = 16; // px gap above footer
      if (footerRect.top < windowHeight) {
        // Footer is visible, move toggle up just above footer
        const overlap = windowHeight - footerRect.top;
        setToggleBottom(Math.max(defaultBottom, overlap + gap));
      } else {
        setToggleBottom(defaultBottom);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`app-root ${currentTheme}`}
      style={{
        '--current-page-color': currentPageData?.color || '#00d068',
        '--current-page-rgb': currentPageData?.color ?
          `${parseInt(currentPageData.color.slice(1, 3), 16)}, ${parseInt(currentPageData.color.slice(3, 5), 16)}, ${parseInt(currentPageData.color.slice(5, 7), 16)}` :
          '0, 208, 104'
      } as React.CSSProperties}
    >
      {/* Animated Background */}
      <div className="animated-background">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${8 + i * 0.5}s`,
              left: `${10 + i * 8}%`,
              animationDelay: `${i * 0.5}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      <nav className="nav-bar glass-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text gradient-text"></span>
          </div>
          <div className="nav-buttons">
            {pages.map(page => (
              <button
                key={page.id}
                className={`nav-btn glass-btn ${currentPage === page.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(page.id)}
                style={{ '--btn-color': page.color } as React.CSSProperties}
              >
                <span className="nav-icon">{page.icon}</span>
                <span className="nav-text">{page.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mode-toggle-container" style={{ bottom: toggleBottom, right: 20, position: 'fixed' }}>
        <ModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>

      <div className="page-container">
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'work' && <WorkExperiencePage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'research' && <ResearchPage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'resume' && <ResumePage />}
        {currentPage === 'blogs' && <BlogsPage />}
        {currentPage === 'education' && <EducationPage />}
      </div>

      {/* Footer */}
      <footer className="footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-simple">
            <p>© 2025 Daksh Malhotra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// BlogTiles: Fetches and displays Medium blog posts as tiles
function BlogTiles({ mediumLinks }: { mediumLinks: string[] }) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMedium() {
      const allPosts: any[] = [];
      for (const link of mediumLinks) {
        try {
          const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(link)}`;
          const res = await axios.get(rssUrl);
          if (res.data && res.data.items) {
            allPosts.push(...res.data.items.slice(0, 3));
          }
        } catch (e) { }
      }
      setPosts(allPosts);
    }
    fetchMedium();
  }, [mediumLinks]);

  return (
    <div className="blog-tiles">
      {posts.length === 0 ? (
        <div className="loading-spinner"></div>
      ) : (
        posts.map(post => (
          <a key={post.guid} href={post.link} target="_blank" rel="noopener" className="blog-tile glass-card">
            <div className="blog-tile-content">
              <h3 className="gradient-text">{post.title}</h3>
              <p>{post.description?.slice(0, 80)}...</p>
            </div>
          </a>
        ))
      )}
    </div>
  );
}

// ProjectCards: Displays featured projects
function ProjectCards({ projects }: { projects: any[] }) {
  return (
    <>
      {projects.map((proj, idx) => (
        <div key={idx} className="project-card glass-card">
          <div className="project-card-content">
            <h3 className="gradient-text">{proj.title}</h3>
            <p>{proj.description}</p>
            <button className="cta-button">View Project</button>
          </div>
        </div>
      ))}
    </>
  );
}

// ContactForm: Simple contact form
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    setSent(true);
    // Integrate with backend/email service as needed
  }

  return (
    <div className="glass-card">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3 className="gradient-text">Contact Me</h3>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            name="name"
            className="form-input"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-input"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea
            name="message"
            className="form-textarea"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="cta-button">
          Send Message ✉️
        </button>
        {sent && <p className="sent-msg gradient-text">Thank you! I'll get back to you soon. ✨</p>}
      </form>
    </div>
  );
}

// Individual Page Components with Glassmorphism and Animations
function AboutPage() {
  return (
    <div className="page about-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text text-glow">
            <span className="page-icon">👨‍💻</span> Hi, I'm DAKSH MALHOTRA
          </h1>
          <h2 className="subtitle typing-animation">Software & AI Engineer</h2>
          <p className="description fade-in-text">Building creative, intelligent, and beautiful digital experiences.</p>
          <p className="bio slide-in-text">
            I am a passionate software and AI engineer, focused on building innovative solutions and creative digital experiences. My expertise spans full-stack development, machine learning, and interactive 3D web technologies.
          </p>

          {/* Technical Skills Section */}
          <div className="technical-skills-section">
            <h2 className="skills-title gradient-text">Technical Skills</h2>
            
            {/* Programming Languages */}
            <div className="skills-category">
              <h3 className="category-title">Programming Languages</h3>
              <div className="skill-bubbles">
                <div className="bubble glass-bubble">JavaScript/TypeScript</div>
                <div className="bubble glass-bubble">Python</div>
                <div className="bubble glass-bubble">Java</div>
                <div className="bubble glass-bubble">C++</div>
              </div>
            </div>

            {/* Frontend */}
            <div className="skills-category">
              <h3 className="category-title">Frontend</h3>
              <div className="skill-bubbles">
                <div className="bubble glass-bubble">React</div>
                <div className="bubble glass-bubble">Vue.js</div>
                <div className="bubble glass-bubble">Three.js</div>
                <div className="bubble glass-bubble">HTML/CSS</div>
              </div>
            </div>

            {/* Backend & Databases */}
            <div className="skills-category">
              <h3 className="category-title">Backend & Databases</h3>
              <div className="skill-bubbles">
                <div className="bubble glass-bubble">Node.js</div>
                <div className="bubble glass-bubble">Express</div>
                <div className="bubble glass-bubble">MongoDB</div>
                <div className="bubble glass-bubble">PostgreSQL</div>
              </div>
            </div>

            {/* AI/ML */}
            <div className="skills-category">
              <h3 className="category-title">AI/ML</h3>
              <div className="skill-bubbles">
                <div className="bubble glass-bubble">TensorFlow</div>
                <div className="bubble glass-bubble">PyTorch</div>
                <div className="bubble glass-bubble">Computer Vision</div>
                <div className="bubble glass-bubble">NLP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkExperiencePage() {
  return (
    <div className="page work-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text">
            <span className="page-icon">💼</span> Work Experience
          </h1>
          <p className="description">My professional journey in technology and cybersecurity.</p>
          <div className="experience-timeline">
            <div className="timeline-item glass-card">
              <div className="timeline-date">July 2025 - Present</div>
              <div className="timeline-content">
                <h3>Intern - KPMG</h3>
                <p>Cybersecurity and technology consulting internship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="page contact-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text zoom-text">
            <span className="page-icon">📱</span> Contact
          </h1>
          <p className="description wave-text">Let's connect! Reach out to me on WhatsApp.</p>
          <div className="contact-container">
            <a 
              href="https://wa.me/919318437008" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-btn glass-btn"
            >
              <span>💬 Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearchPage() {
  return (
    <div className="page research-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text zoom-text">
            <span className="page-icon">🔬</span> Research
          </h1>
          <p className="description wave-text">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2;
  
  const projects = [
    {
      title: "AI Scheduler",
      description: "An intelligent scheduling application built with modern web technologies. Features smart time management and automated scheduling capabilities.",
      link: "https://ai-scheduler-rho.vercel.app/",
      tech: ["React", "Node.js", "AI/ML", "Vercel"]
    },
    {
      title: "A11y Audit Pro",
      description: "Web accessibility auditing tool that helps developers identify and fix accessibility issues in their applications.",
      link: "https://a11y-audit-pro.vercel.app/",
      tech: ["Accessibility", "JavaScript", "Web Standards", "Vercel"]
    },
    {
      title: "Github Analyzer",
      description: "A comprehensive GitHub repository analysis tool built with multiple technologies. Analyzes code, commits, and repository metrics.",
      link: "https://github.com/idakshmalhotra/Github-analyzer",
      tech: ["Python", "JavaScript", "CSS", "HTML"]
    }
  ];

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIdx = (currentPage - 1) * projectsPerPage;
  const endIdx = startIdx + projectsPerPage;
  const currentProjects = projects.slice(startIdx, endIdx);

  return (
    <div className="page projects-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text zoom-text">
            <span className="page-icon">🚀</span> Projects
          </h1>
          <p className="description wave-text">Featured projects showcasing my technical expertise and creativity.</p>
          <div className="projects-grid">
            {currentProjects.map((project, index) => (
              <div key={index} className="project-card glass-card">
                <div className="project-card-content">
                  <h3 className="gradient-text">{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cta-button"
                  >
                    View Project →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              className="glass-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`glass-btn${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="glass-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogsPage() {
  return (
    <div className="page blogs-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text glitch-text">
            <span className="page-icon">📝</span> Blogs
          </h1>
          <p className="description slide-in-text">Sharing insights, tutorials, and thoughts on technology and innovation.</p>
          <div className="blogs-container">
            <BlogTiles mediumLinks={["https://medium.com/feed/@iamdakshmalhotra"]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationPage() {
  return (
    <div className="page education-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text bounce-text">
            <span className="page-icon">🎓</span> Education
          </h1>
          <p className="description elastic-text">Currently pursuing my Bachelor's degree in Computer Science.</p>
          <div className="education-cards">
            <div className="edu-card glass-card">
              <h3>Bachelor of Technology</h3>
              <p>Computer Science Engineering</p>
              <p>Maharaja Surajmal Institute of Technology</p>
              <p className="edu-duration">2023 - 2027</p>
              <div className="edu-details">
                <p>• Currently in Third Year</p>
                <p>• Specializing in Computer Science and Engineering</p>
                <p>• Focus on Advanced Programming, Data Structures, and Software Development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumePage() {
  return (
    <div className="page resume-page">
      <div className="page-header">
        <div className="glass-content">
          <h1 className="main-title gradient-text zoom-text">
            <span className="page-icon">📄</span> Resume
          </h1>
          <p className="description wave-text">Download my resume to learn more about my qualifications and experience.</p>
          <div className="resume-container">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="download-btn glass-btn">
              Download Resume (PDF) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;