const steps = [
  {
    no: "01",
    title: "Design",
    desc: "Build workflows visually—define rules, approval processes, and business logic without extensive coding.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    no: "02",
    title: "Integrate",
    desc: "Connect CRM, ERP, HR, support tools, databases, APIs, and cloud services into end-to-end processes.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="5" cy="6" r="2.5" />
        <circle cx="19" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M7 7.5 10.5 16" />
        <path d="M17 7.5 13.5 16" />
        <path d="M7.5 6h9" />
      </svg>
    ),
  },
  {
    no: "03",
    title: "Automate",
    desc: "Trigger AI agents, bots, notifications, and task assignments to move work forward automatically.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
  {
    no: "04",
    title: "Govern",
    desc: "Apply role-based access, approvals, and controls so processes execute securely and consistently.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
        <path d="m9 11.5 2 2 4-4" />
      </svg>
    ),
  },
  {
    no: "05",
    title: "Monitor",
    desc: "Track execution through dashboards and analytics to spot bottlenecks and optimization opportunities.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 3v18h18" />
        <path d="M7 15l3.5-4 3 3L21 7" />
      </svg>
    ),
    noArrow: true,
  },
];

const How = () => {
  return (
    <section className="how section-pad" id="how">
      <div className="site-shell">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">How qubi works</div>
            <h2>Design, deploy, and run workflows visually.</h2>
          </div>
          
        </div>
        <div className="steps reveal">
          {steps.map((step) => (
            <article className="step" key={step.no}>
              <span className="step-no">{step.no}</span>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {!step.noArrow && <span className="step-arrow">→</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default How;
