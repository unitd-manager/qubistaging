const Why = () => {
  return (
    <section className="why section-pad" id="why">
      <div className="site-shell">
        <div className="manifesto-grid">
          <div className="manifesto-sticky reveal">
            <div className="eyebrow">Why qubi exists</div>
            <h2>Modern work runs on <em>too many systems.</em></h2>
            <p>
              Enterprises rely on multiple applications, systems, and teams to complete critical processes. Managing
              these workflows manually leads to delays, errors, and rising operational costs. Qubi Flow Orchestrator
              provides a centralized platform to automate, monitor, and optimize business processes across
              departments and systems.
            </p>
            <div className="outcome-ribbon">
              <div className="outcome-card">
                <strong>Fewer errors</strong>
                <span>Automate routine tasks to reduce human error and improve process consistency.</span>
              </div>
              <div className="outcome-card">
                <strong>Faster cycles</strong>
                <span>Speed up approvals and resource utilization across departments.</span>
              </div>
              <div className="outcome-card">
                <strong>Full visibility</strong>
                <span>Track workflow execution and performance in real time.</span>
              </div>
            </div>
          </div>
          <div className="manifesto-lines reveal">
            <div className="manifesto-line"><div className="num">01</div><h3>Critical processes span many applications and teams.</h3></div>
            <div className="manifesto-line"><div className="num">02</div><h3>Manual handoffs create delays, errors, and cost.</h3></div>
            <div className="manifesto-line"><div className="num">03</div><h3>Approvals stall in inboxes, spreadsheets, and chat.</h3></div>
            <div className="manifesto-line"><div className="num">04</div><h3>Leaders lack real-time visibility into performance.</h3></div>
            <div className="manifesto-line"><div className="num">05</div><h3>Adding more point tools only deepens the fragmentation.</h3></div>
            <div className="manifesto-line highlight"><div className="num">06</div><h3>Qubi Flow Orchestrator connects it all in one centralized, governed platform.</h3></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;
