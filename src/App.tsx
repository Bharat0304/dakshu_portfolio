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
          <div className="skill-bubbles">
            <div className="bubble glass-bubble">React</div>
            <div className="bubble glass-bubble">AI/ML</div>
            <div className="bubble glass-bubble">Three.js</div>
            <div className="bubble glass-bubble">Python</div>
            <div className="bubble glass-bubble">Node.js</div>
            <div className="bubble glass-bubble">TypeScript</div>
            <div className="bubble glass-bubble">Deep Learning</div>
            <div className="bubble glass-bubble">Computer Vision</div>
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
          <p className="description">My professional journey includes impactful roles in software engineering, AI research, and product development.</p>
          <div className="experience-timeline">
            <div className="timeline-item glass-card">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>Senior Software Engineer</h3>
                <p>Leading AI/ML initiatives and full-stack development projects</p>
              </div>
            </div>
            <div className="timeline-item glass-card">
              <div className="timeline-date">2023</div>
              <div className="timeline-content">
                <h3>AI Research Assistant</h3>
                <p>Conducted research in computer vision and natural language processing</p>
              </div>
            </div>
            <div className="timeline-item glass-card">
              <div className="timeline-date">2022</div>
              <div className="timeline-content">
                <h3>Full Stack Developer</h3>
                <p>Developed scalable web applications using modern technologies</p>
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
          <h1 className="main-title gradient-text pulse-text">
            <span className="page-icon">📞</span> Contact
          </h1>
          <p className="description glow-text">Interested in collaborating or learning more? Reach out via the contact form below.</p>
          <ContactForm />
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
          <h1 className="main-title gradient-text rainbow-text">
            <span className="page-icon">🔬</span> Research
          </h1>
          <p className="description elastic-text">Exploring cutting-edge technologies and contributing to scientific advancement.</p>
          <div className="research-grid">
            <div className="research-item glass-card">
              <h3>Machine Learning in Healthcare</h3>
              <p>Developing AI models for medical diagnosis and treatment prediction</p>
            </div>
            <div className="research-item glass-card">
              <h3>Computer Vision Applications</h3>
              <p>Creating innovative visual recognition systems for real-world problems</p>
            </div>
            <div className="research-item glass-card">
              <h3>Natural Language Processing</h3>
              <p>Advancing human-computer interaction through language understanding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  // Example projects array (expand as needed)
  const projects = [
    { title: "AI Chatbot", description: "Conversational AI powered by transformer models." },
    { title: "3D Portfolio", description: "Creative portfolio with Three.js and React." },
    { title: "ML Dashboard", description: "Interactive dashboard for machine learning experiments." },
    { title: "Computer Vision App", description: "Real-time object detection and classification system." },
    { title: "Neural Network Visualizer", description: "Interactive tool for understanding deep learning architectures." },
    { title: "Data Analytics Platform", description: "Comprehensive platform for data analysis and visualization." },
    { title: "2-Tier Application Deployment", description: "Deployed a scalable two-tier application using Flask and MySQL on a Kubernetes cluster with Docker, capable of handling 10,000 concurrent users." },
    { title: "Infrastructure as Code Deployment", description: "Provisioned and managed AWS infrastructure using Terraform with GitHub Actions CI/CD, supporting reusable and modular configurations for scalable cloud deployments." },
    { title: "HashMap.ai", description: "Built the backend for an AI-powered job application platform using a monorepo structure, Kafka for real-time messaging between Golang and Node.js microservices." },
    // Add more projects as needed
  ];
  const projectsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
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
          <p className="description wave-text">Showcase of my technical projects and creative implementations.</p>
          <div className="projects-grid">
            <ProjectCards projects={currentProjects} />
          </div>
          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
            <button className="glass-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo; Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`glass-btn${currentPage === i + 1 ? ' active' : ''}`}
                style={{ minWidth: 36, fontWeight: currentPage === i + 1 ? 700 : 500 }}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button className="glass-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &raquo;</button>
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
            <BlogTiles mediumLinks={["https://medium.com/@yourusername/latest"]} />
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
          <p className="description elastic-text">My academic journey and continuous learning in technology and AI.</p>
          <div className="education-cards">
            <div className="edu-card glass-card">
              <h3>Computer Science Degree</h3>
              <p>Bachelor's in Computer Science</p>
              <p>University Name - 2021</p>
            </div>
            <div className="edu-card glass-card">
              <h3>AI/ML Specialization</h3>
              <p>Machine Learning and Deep Learning</p>
              <p>Tech Institute - 2022</p>
            </div>
            <div className="edu-card glass-card">
              <h3>Full Stack Development</h3>
              <p>Modern Web Development Technologies</p>
              <p>Online Certification - 2023</p>
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
          <h1 className="main-title gradient-text wave-text">
            <span className="page-icon">📄</span> Resume
          </h1>
          <p className="description fade-in-text">Professional summary of my skills, experience, and achievements.</p>
          
          <div className="resume-container">
            {/* Download Button */}
            <div className="resume-download glass-card">
              <h3 className="gradient-text">📄 Download Resume</h3>
              <p>Get a PDF version of my complete resume</p>
              <button 
                className="cta-button"
                onClick={() => window.open('/resume.pdf', '_blank')}
              >
                Download PDF 📥
              </button>
            </div>

            {/* Resume Sections */}
            <div className="resume-sections">
              {/* Summary */}
              <div className="resume-section glass-card">
                <h3 className="section-title gradient-text">Professional Summary</h3>
                <p>Experienced Software & AI Engineer with expertise in full-stack development, machine learning, and interactive web technologies. Passionate about creating innovative solutions and pushing the boundaries of what's possible with technology.</p>
              </div>

              {/* Skills */}
              <div className="resume-section glass-card">
                <h3 className="section-title gradient-text">Technical Skills</h3>
                <div className="skills-grid">
                  <div className="skill-category">
                    <h4>Programming Languages</h4>
                    <div className="skill-tags">
                      <span className="skill-tag">JavaScript/TypeScript</span>
                      <span className="skill-tag">Python</span>
                      <span className="skill-tag">Java</span>
                      <span className="skill-tag">C++</span>
                    </div>
                  </div>
                  <div className="skill-category">
                    <h4>Frontend</h4>
                    <div className="skill-tags">
                      <span className="skill-tag">React</span>
                      <span className="skill-tag">Vue.js</span>
                      <span className="skill-tag">Three.js</span>
                      <span className="skill-tag">HTML/CSS</span>
                    </div>
                  </div>
                  <div className="skill-category">
                    <h4>Backend & Databases</h4>
                    <div className="skill-tags">
                      <span className="skill-tag">Node.js</span>
                      <span className="skill-tag">Express</span>
                      <span className="skill-tag">MongoDB</span>
                      <span className="skill-tag">PostgreSQL</span>
                    </div>
                  </div>
                  <div className="skill-category">
                    <h4>AI/ML</h4>
                    <div className="skill-tags">
                      <span className="skill-tag">TensorFlow</span>
                      <span className="skill-tag">PyTorch</span>
                      <span className="skill-tag">Computer Vision</span>
                      <span className="skill-tag">NLP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="resume-section glass-card">
                <h3 className="section-title gradient-text">Work Experience</h3>
                <div className="experience-item">
                  <div className="experience-header">
                    <h4>Senior Software Engineer</h4>
                    <span className="experience-date">2024 - Present</span>
                  </div>
                  <p className="company">Tech Company Inc.</p>
                  <ul>
                    <li>Led AI/ML initiatives and full-stack development projects</li>
                    <li>Developed scalable web applications using modern technologies</li>
                    <li>Mentored junior developers and conducted code reviews</li>
                  </ul>
                </div>
                <div className="experience-item">
                  <div className="experience-header">
                    <h4>AI Research Assistant</h4>
                    <span className="experience-date">2023 - 2024</span>
                  </div>
                  <p className="company">Research Institute</p>
                  <ul>
                    <li>Conducted research in computer vision and natural language processing</li>
                    <li>Published papers in top-tier conferences</li>
                    <li>Developed novel algorithms for image recognition</li>
                  </ul>
                </div>
              </div>

              {/* Education */}
              <div className="resume-section glass-card">
                <h3 className="section-title gradient-text">Education</h3>
                <div className="education-item">
                  <div className="education-header">
                    <h4>Bachelor of Science in Computer Science</h4>
                    <span className="education-date">2019 - 2023</span>
                  </div>
                  <p className="institution">University Name</p>
                  <p>GPA: 3.8/4.0 | Relevant Coursework: Data Structures, Algorithms, Machine Learning, Computer Vision</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;