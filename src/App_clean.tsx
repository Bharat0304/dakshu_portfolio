import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const pages = [
    { id: 'about', name: 'About', icon: '👨‍💻', color: '#00d068' },           // Emerald Green
    { id: 'education', name: 'Education', icon: '🎓', color: '#007cf0' },     // Electric Blue  
    { id: 'work', name: 'Work Experience', icon: '💼', color: '#7f00ff' },   // Purple Accent
    { id: 'projects', name: 'Projects', icon: '🚀', color: '#00ffff' },      // Cyan
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
            <span className="mode-text">
                {isDarkMode ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [currentPage, setCurrentPage] = useState('about');

    // Page to theme mapping based on exact colors
    const pageThemeMap: { [key: string]: string } = {
        'about': 'emerald',
        'education': 'electric-blue',
        'work': 'purple',
        'projects': 'cyan',
        'blogs': 'pink',
        'research': 'coral',
        'contact': 'deep-blue'
    };

    // Get current theme based on page and mode
    const currentTheme = `${pageThemeMap[currentPage]}-${isDarkMode ? 'dark' : 'light'}`;
    const currentPageData = pages.find(p => p.id === currentPage);

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
                        <span className="logo-text gradient-text">DAKSH MALHOTRA</span>
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

            <div className="mode-toggle-container">
                <ModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>

            <div className="page-container">
                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'work' && <WorkExperiencePage />}
                {currentPage === 'contact' && <ContactPage />}
                {currentPage === 'research' && <ResearchPage />}
                {currentPage === 'projects' && <ProjectsPage />}
                {currentPage === 'blogs' && <BlogsPage />}
                {currentPage === 'education' && <EducationPage />}
            </div>
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
        <div className="project-cards">
            {projects.map((proj, idx) => (
                <div key={idx} className="project-card glass-card">
                    <div className="project-card-content">
                        <h3 className="gradient-text">{proj.title}</h3>
                        <p>{proj.description}</p>
                        <button className="cta-button">View Project</button>
                    </div>
                </div>
            ))}
        </div>
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
    return (
        <div className="page projects-page">
            <div className="page-header">
                <div className="glass-content">
                    <h1 className="main-title gradient-text zoom-text">
                        <span className="page-icon">🚀</span> Projects
                    </h1>
                    <p className="description wave-text">Showcase of my technical projects and creative implementations.</p>
                    <div className="projects-grid">
                        <ProjectCards projects={[
                            { title: "AI Chatbot", description: "Conversational AI powered by transformer models." },
                            { title: "3D Portfolio", description: "Creative portfolio with Three.js and React." },
                            { title: "ML Dashboard", description: "Interactive dashboard for machine learning experiments." },
                            { title: "Computer Vision App", description: "Real-time object detection and classification system." },
                            { title: "Neural Network Visualizer", description: "Interactive tool for understanding deep learning architectures." },
                            { title: "Data Analytics Platform", description: "Comprehensive platform for data analysis and visualization." }
                        ]} />
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

export default App;
