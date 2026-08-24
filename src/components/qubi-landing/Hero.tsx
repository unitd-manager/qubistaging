interface HeroProps {
  onOpenVideo: () => void;
}

const Hero = ({ onOpenVideo }: HeroProps) => {
  return (
    <header className="hero">
      <div className="site-shell hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow">Agentic automation platform</div>
          <h1>Orchestrate AI agents, bots, systems &amp; <em>people.</em></h1>
          <p>
            A unified platform for designing, deploying, and managing intelligent workflows powered by AI agents,
            automation, human input, and enterprise integrations moving work from request to resolution without
            the usual handoffs and bottlenecks.
          </p>
          <div className="hero-actions">
            <button className="btn btn-orange" onClick={onOpenVideo}>▶ Watch the 12-minute demo</button>
            <a className="btn btn-light" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo ↗</a>
          </div>
          <div className="micro-proof">
            <div className="proof-dots"><span></span><span></span><span></span></div>
            Built for operations, finance, IT, and transformation teams.
          </div>
        </div>

        <div className="demo-stage reveal">
          <div className="orbit one"></div>
          <div className="orbit two"></div>
          <div className="float-pill pill-1"><i></i>AI agents</div>
          <div className="float-pill pill-2"><i></i>Enterprise systems</div>
          <div className="float-pill pill-3"><i></i>Human approvals</div>
          <div className="float-pill pill-4"><i></i>Automations</div>
          <div className="product-window">
            <div className="window-top">
              <div className="window-dots"><span></span><span></span><span></span></div>
              <div className="window-title">qubi orchestration workspace</div>
              <div style={{ width: 44 }}></div>
            </div>
            <div className="window-body">
              <aside className="sidebar">
                <div className="side-logo">qubi</div>
                <div className="side-item active">◉ Orchestrations</div>
                <div className="side-item">⌁ Agents</div>
                <div className="side-item">◇ Workflows</div>
                <div className="side-item">↗ Integrations</div>
                <div className="side-item">▦ Analytics</div>
                <div className="side-item">♙ Governance</div>
              </aside>
              <div className="workspace">
                <div className="workspace-head">
                  <div>
                    <h3>Customer onboarding</h3>
                    <p>End-to-end intelligent workflow</p>
                  </div>
                  <div className="status">● Running</div>
                </div>
                <div className="flow-canvas">
                  <div className="flow-line line-a"></div>
                  <div className="flow-line line-b"></div>
                  <div className="flow-line line-c"></div>
                  <div className="flow-line line-d"></div>
                  <div className="flow-node node-1"><strong><b></b>Request received</strong><span>Capture context and intent</span></div>
                  <div className="flow-node node-2"><strong><b></b>AI agent</strong><span>Reason across knowledge</span></div>
                  <div className="flow-node node-3"><strong><b></b>System action</strong><span>Create records and tasks</span></div>
                  <div className="flow-node node-4"><strong><b></b>Complete</strong><span>Notify and report outcome</span></div>
                  <div className="flow-node node-5"><strong><b></b>Human review</strong><span>Approve high-impact step</span></div>
                </div>
              </div>
            </div>
            <div className="play-overlay" onClick={onOpenVideo}><div className="play-button">▶</div></div>
          </div>
          <div className="demo-label"><strong>Full product demo</strong><span>12 min · end-to-end walkthrough</span></div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
