interface CtaProps {
  onOpenVideo: () => void;
}

const Cta = ({ onOpenVideo }: CtaProps) => {
  return (
    <section className="cta-wrap">
      <div className="site-shell">
        <div className="cta reveal">
          <div className="cta-inner">
            <div className="eyebrow" style={{ color: "white" }}>See qubi in action</div>
            <h2>Stop adding AI.<br />Start orchestrating it.</h2>
            <p>
              Watch the complete product walkthrough or bring us a workflow your team wants to improve. We'll show
              you how qubi can move it from intent to outcome.
            </p>
            <div className="cta-actions">
              <button className="btn btn-dark" onClick={onOpenVideo}>▶ Watch the demo</button>
              <a className="btn btn-light" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
