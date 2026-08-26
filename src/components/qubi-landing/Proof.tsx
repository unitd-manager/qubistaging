const Proof = () => {
  return (
    <section className="proof section-pad" id="customers">
      <div className="site-shell">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Customer success</div>
            <h2>Proof that orchestration changes the work.</h2>
          </div>
          <p>Use this section for validated customer stories and approved performance metrics. The cards below demonstrate the intended presentation.</p>
        </div>
        <div className="story-grid reveal">
          <article className="story-main">
            <span className="story-tag">Featured customer story</span>
            <blockquote>One intelligent flow replaced the gaps between people, systems, and automation.</blockquote>
            <div className="story-foot">
              <div className="story-metric">
                <strong>End-to-end</strong>
                <span>visibility from request through resolution</span>
              </div>
              <a className="btn btn-light" href="https://myqubi.com/customers" target="_blank" rel="noreferrer">Read the Stories →</a>
            </div>
          </article>
          <div className="story-side">
            <article className="story-card">
              <div>
                <span className="eyebrow">Finance</span>
                <h3>Faster invoice approvals, fewer errors.</h3>
                <p>See how qubi coordinates document processing, policy checks, approvals, and ERP actions.</p>
              </div>
              {/* TODO: "View customer story" link removed until individual customer story
                  page template is provided. Re-add once available (least priority). */}
            </article>
            <article className="story-card">
              <div>
                <span className="eyebrow">Human resources</span>
                <h3>Onboarding without fragmented handoffs.</h3>
                <p>Automated document collection, access provisioning, approvals, and communication in one flow.</p>
              </div>
              {/* TODO: "View customer story" link removed until individual customer story
                  page template is provided. Re-add once available (least priority). */}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
