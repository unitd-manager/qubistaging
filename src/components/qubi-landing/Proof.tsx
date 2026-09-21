import qubiCube from "@/assets/qbcomp.webp";

const Proof = () => {
  return (
    <>
      <section className="proof section-pad" id="customers">
        <div className="site-shell">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Customer success</div>
              <h2>Proof that orchestration changes the work.</h2>
            </div>
          </div>
          <div className="story-grid reveal">
            <article className="story-main">
              <span className="story-tag">Featured customer story</span>
              <blockquote>One intelligent flow replaced the gaps between people, systems, and automation.</blockquote>
              <div className="story-foot">
                <div className="story-metric">
                  <strong>End-to-end</strong>
                </div>
                <a className="btn btn-light" href="/customers">Read the Stories →</a>
              </div>
            </article>
            <div className="story-side">
              <article className="story-card">
                <div>
                  <span className="eyebrow">Finance</span>
                  <h3>Faster invoice approvals, fewer errors.</h3>
                  <p>See how qubi coordinates document processing, policy checks, approvals, and ERP actions.</p>
                </div>
              </article>
              <article className="story-card">
                <div>
                  <span className="eyebrow">Human resources</span>
                  <h3>Onboarding without fragmented handoffs.</h3>
                  <p>Automated document collection, access provisioning, approvals, and communication in one flow.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by qBotica - attached at last of Proof */}
      <div className="cs-bridge">
        <div className="cs-shell">
          <div className="cs-bridge-box">
            <div className="cs-bridge-copy">
              <img src={qubiCube} alt="qubi" className="cs-bridge-logo" />
              <div>
                <h3>Powered by <span className="cs-bridge-qbotica-text">qBotica</span></h3>
                <p>Want to know more about the company behind qubi and our enterprise automation work?</p>
              </div>
            </div>
            <a className="cs-btn cs-btn-dark" href="https://www.qbotica.com/" target="_blank" rel="noreferrer">
              Learn more about qBotica ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proof;