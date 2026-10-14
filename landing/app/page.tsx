import AlbumShowcase from "./components/AlbumShowcase";

const appUrl = "/app";
const githubUrl = "https://github.com/av1452/vibeflow";

const features = [
  {
    number: "01",
    icon: "◈",
    title: "Explore through Cover Flow",
    description:
      "Browse album artwork in a layered, interactive carousel inspired by the classic iPod experience.",
  },
  {
    number: "02",
    icon: "⌕",
    title: "Find your music",
    description:
      "Search Apple's music catalog and discover albums and tracks to explore.",
  },
  {
    number: "03",
    icon: "♫",
    title: "Listen your way",
    description:
      "Open the integrated Apple Music player for supported tracks.",
  },
  {
    number: "04",
    icon: "↔",
    title: "Browse on any screen",
    description:
      "Swipe through covers on mobile or use the navigation arrows.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">V</span>
          vibeflow
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="nav-cta" href={appUrl}>
            Open app ↗
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> A fresh take on music discovery</div>
          <h1>Music deserves<br />a little <span>more flow.</span></h1>
          <p className="hero-description">
            Rediscover the joy of browsing music. VibeFlow brings album artwork
            front and center in an interactive experience inspired by the classic
            iPod Cover Flow.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={appUrl}>
              Try VibeFlow <span>↗</span>
            </a>
            <a className="button button-secondary" href="#features">
              Explore features ↓
            </a>
          </div>
          <div className="hero-note"><span className="note-icon">♫</span> Made for music lovers and curious minds.</div>
        </div>

        <AlbumShowcase />
      </section>
      <section className="intro-strip">
        <span>LESS SCROLLING.</span><span className="strip-star">✳</span>
        <span>MORE EXPLORING.</span><span className="strip-star">✳</span>
        <span>ALL ABOUT THE MUSIC.</span>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE EXPERIENCE</div>
            <h2>A familiar feeling.<br /><span>A new way to explore.</span></h2>
          </div>
          <p>
            Built around the simple idea that discovering music should feel
            just as good as listening to it.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-top">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-number">{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="eyebrow">YOUR NEXT LISTEN STARTS HERE</div>
        <h2>Ready to get in the flow?</h2>
        <p>Jump in, search for something you love, and explore.</p>
        <a className="button button-primary" href={appUrl}>
          Launch VibeFlow ↗
        </a>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#">
          <span className="brand-icon">V</span> vibeflow
        </a>
        <span className="footer-note">
          An independent music interface project.
        </span>
        <div className="footer-links">
          <a href="https://myportfolio-sigma-one-55.vercel.app" target="_blank" rel="noreferrer">
            Created by Aidan Vazquez ↗
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={appUrl}>Web app ↗</a>
        </div>
      </footer>
    </main>
  );
}
