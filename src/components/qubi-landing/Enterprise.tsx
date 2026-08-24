import demoVideo from "@/assets/demo.mp4";

const Enterprise = () => {
  return (
    <section className="enterprise section-pad" id="enterprise">
      <div className="site-shell">

        <div className="enterprise-intro reveal">
          <div>
            <div className="eyebrow">Built for enterprise</div>
            <h2>
              Powerful enough to act.<br />
              <em>Controlled enough to trust.</em>
            </h2>
          </div>

          <div className="enterprise-intro-copy">
            <div className="confidence-strip">
              <span>Process automation</span>
              <span>Role-based access control</span>
              <span>Real-time monitoring</span>
              <span>Workflow analytics</span>
              <span>Scalable architecture</span>
            </div>
          </div>
        </div>

        <div className="enterprise-grid reveal">

          {/* DEMO VIDEO - LEFT SIDE */}
         <article className="confidence-main">
  <div>
    <span className="confidence-kicker">The control layer</span>

    <h3>
      AI that knows when to act and when to ask.
    </h3>

    <p>
      Set the boundaries once. qubi automates routine work, pauses for approval
      at critical moments, enforces role-based permissions, and records every
      decision with a complete audit trail.
    </p>
  </div>

  {/* ONLY THIS PART IS REPLACED */}
  <div className="enterprise-video-box">
    <video
      src={demoVideo}
      autoPlay
      muted
      loop
      playsInline
      controls
    />
  </div>
</article>

         
          {/* RIGHT SIDE - EXISTING CARDS */}
          <div className="confidence-side">

            <article className="confidence-card">
              <div>
                <div className="confidence-icon">◈</div>
                <h3>Role-based access control</h3>
                <p>
                  Ensure secure workflow management and data protection across
                  every team and environment.
                </p>
              </div>

              <ul>
                <li>Granular permissions</li>
                <li>Governed data access</li>
                <li>Policy-aligned execution</li>
              </ul>
            </article>

            <article className="confidence-card">
              <div>
                <div className="confidence-icon">↗</div>
                <h3>System integration</h3>
                <p>
                  Connect enterprise applications, databases, APIs, and
                  third-party platforms into one flow.
                </p>
              </div>

              <ul>
                <li>CRM, ERP &amp; HR systems</li>
                <li>Support &amp; cloud services</li>
                <li>Existing stack stays in place</li>
              </ul>
            </article>

            <article className="confidence-card">
              <div>
                <div className="confidence-icon">▦</div>
                <h3>Real-time monitoring</h3>
                <p>
                  Track workflow execution and performance through dashboards
                  and analytics.
                </p>
              </div>

              <div className="visibility-mini">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </article>

            <article className="confidence-card">
              <div>
                <div className="confidence-icon">⤢</div>
                <h3>Scalable architecture</h3>
                <p>
                  Support growing business needs with enterprise-grade
                  scalability, start with one workflow and extend across
                  departments.
                </p>
              </div>

              <ul>
                <li>Enterprise-grade scale</li>
                <li>Reusable workflow patterns</li>
                <li>Cross-functional teams</li>
              </ul>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Enterprise;