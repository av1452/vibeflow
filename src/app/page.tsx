import CoverFlow from "@/components/CoverFlow";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="logo">
          VIBE<span>FLOW</span>
        </div>
        <div className="header-label">
          A DIFFERENT WAY TO LISTEN
        </div>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">MUSIC IN MOTION</p>
          <h2>Your music.<br />Your world.</h2>
          <p>A little nostalgia. A whole new vibe.</p>
        </section>

        <CoverFlow />
      </main>
    </>
  );
}
