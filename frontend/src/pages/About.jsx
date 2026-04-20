import ThemeToggle from '../components/ThemeToggle';

const teamMembers = [
  {
    name: 'Rounak Kumar Mahato',
    role: 'Team Leader · Backend',
    description: 'Handled backend architecture and core system logic.',
    linkedin: 'https://www.linkedin.com/in/rounak-kumar-mahto/',
    email: 'rounak.k.mahto@gmail.com',
    github: 'https://github.com/thechamprk'
  },
  {
    name: 'Khushi Kumari',
    role: 'API Integration',
    description: 'Integrated APIs and ensured smooth data communication.',
    linkedin: 'https://www.linkedin.com/in/khushi-kumari-654617325/',
    email: 'khushi.ece.rec@gmail.com',
    github: 'https://github.com/its-kittu'
  },
  {
    name: 'Abhinav Kumar',
    role: 'Frontend Developer',
    description: 'Designed and developed user interface and experience.',
    linkedin: '',
    email: 'yt184ab@gmail.com',
    github: 'https://github.com/star-abv'
  }
];

function About({ onNavigate }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>About Hindsight Expert</h1>
          <p>The team and mission behind persistent-memory support AI</p>
        </div>
        <div className="app-header-right">
          <ThemeToggle />
          <button className="btn-secondary" type="button" onClick={() => onNavigate('/')}>
            Back to Home
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="about-page-card">
          <h2>Our Mission</h2>
          <p>
            Hindsight Expert is built to make support systems context-aware, reliable, and scalable. Instead of
            restarting from zero on every interaction, we use persistent memory and retrieval intelligence so every
            response improves over time.
          </p>
          <p>
            We focus on practical outcomes: quicker resolutions, cleaner escalation paths, and a support experience
            that feels informed, calm, and human.
          </p>
        </section>

        <section className="about-page-card">
          <h2>Meet the Developers</h2>
          <p className="muted">Get in touch with our amazing team.</p>

          <div className="about-contact-grid">
            {teamMembers.map((member) => (
              <article className="about-contact-card" key={member.name}>
                <p className="about-contact-role">{member.role}</p>
                <h3 className="about-contact-name">{member.name}</h3>
                <p className="about-contact-desc">{member.description}</p>
                <div className="about-contact-icons">
                  {member.email ? (
                    <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                      Email
                    </a>
                  ) : null}
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn ${member.name}`}>
                      LinkedIn
                    </a>
                  ) : null}
                  {member.github ? (
                    <a href={member.github} target="_blank" rel="noreferrer" aria-label={`GitHub ${member.name}`}>
                      GitHub
                    </a>
                  ) : null}
                  {!member.linkedin && !member.email && !member.github ? <span>No public links yet.</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
