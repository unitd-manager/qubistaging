import { useState } from "react";
import "./Pricingpage.css";
import "../qubi-landing/qubi-landing.css";
import Nav from "../qubi-landing/Nav";
import QubiFooter from "../qubi-landing/QubiFooter";
import VideoModal from "../qubi-landing/VideoModal";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import { X } from "lucide-react";
import qubiCube from "@/assets/qbcomp.webp";
type Plan = {
  id: string;
  kicker: string;
  title: string;
  desc: string;
  features: string[];
  cta: string;
  fit: string;
  fitCopy: string;
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    kicker: "For single-workflow deployments",
    title: "Starter Execution",
    desc: "Ideal for organizations that want to start with one critical workflow and prove ROI before scaling.",
    features: [
      "1 end-to-end workflow execution",
      "DocumentAI for up to 3 document types",
      "AI agent decision-making",
      "Up to 5 enterprise system integrations",
      "Standard SLA (business hours)",
      "Dedicated implementation engineer",
      "Monthly outcome reporting",
    ],
    cta: "Talk to Us →",
    fit: "Start with one critical workflow",
    fitCopy:
      "Best suited to organizations validating ROI before expanding to broader execution.",
  },
  {
    id: "enterprise",
    kicker: "For multi-workflow, enterprise-scale operations",
    title: "Enterprise Execution",
    desc: "Full-scale AI execution across multiple workflows, with our team running everything as a managed service.",
    features: [
      "Unlimited workflow executions",
      "Full DocumentAI any document type",
      "Advanced AI agent orchestration",
      "Unlimited enterprise integrations",
      "24/7 managed service SLA",
      "Dedicated execution team",
      "Real-time outcome dashboards",
      "Exception handling and escalation management",
    ],
    cta: "Talk to Us →",
    fit: "Multi-workflow execution at scale",
    fitCopy:
      "The most comprehensive standard program for organizations running multiple workflows as a managed service.",
    popular: true,
  },
  {
    id: "custom",
    kicker: "For transformational initiatives",
    title: "Custom Program",
    desc: "Co-design an enterprise AI execution program aligned to your most critical operational transformation goals.",
    features: [
      "Everything in Enterprise Execution",
      "Co-designed execution roadmap",
      "Executive sponsorship alignment",
      "Custom outcome metrics and SLAs",
      "Dedicated VP of Delivery",
      "Innovation lab access",
      "Priority feature development",
    ],
    cta: "Contact Us →",
    fit: "Enterprise transformation",
    fitCopy:
      "Designed around high-priority initiatives that require custom outcomes, governance, and delivery alignment.",
  },
];

const comparisonRows = [
  ["Program fit", "Single critical workflow", "Multi-workflow, enterprise-scale operations", "Transformational initiatives"],
  ["Workflow execution", "1 end-to-end workflow execution", "Unlimited workflow executions", "Everything in Enterprise Execution"],
  ["DocumentAI", "Up to 3 document types", "Full DocumentAI any document type", "Everything in Enterprise Execution"],
  ["AI orchestration", "AI agent decision-making", "Advanced AI agent orchestration", "Custom execution roadmap"],
  ["Enterprise integrations", "Up to 5 enterprise system integrations", "Unlimited enterprise integrations", "Everything in Enterprise Execution"],
  ["Service level", "Standard SLA (business hours)", "24/7 managed service SLA", "Custom outcome metrics and SLAs"],
  ["Delivery support", "Dedicated implementation engineer", "Dedicated execution team", "Dedicated VP of Delivery"],
  ["Reporting", "Monthly outcome reporting", "Real-time outcome dashboards", "Custom outcome metrics and SLAs"],
  ["Additional program elements", "—", "Exception handling and escalation management", "Executive sponsorship alignment · Innovation lab access · Priority feature development"],
];

const faqs = [
  ["How is qBotica priced?", "qBotica operates on an outcome-based model. You pay for work completed, not licenses consumed. Pricing is scoped per workflow based on volume, complexity, and the number of systems involved. We provide a detailed SOW after a discovery session."],
  ["Is there a free trial or POC?", "We do not offer free trials or open-ended POCs. We do offer a paid pilot on a single workflow with defined success metrics, so you can validate ROI before committing to full deployment."],
  ["How long does implementation take?", "Most workflows go live within 6-10 weeks. Complex multi-system orchestrations may take 12-16 weeks. We provide a detailed timeline during scoping."],
  ["What systems does qubi integrate with?", "qubi has 500+ pre-built connectors covering SAP, Oracle, Salesforce, ServiceNow, Workday, and most major enterprise platforms. We also build custom integrations as part of the managed service."],
  ["What happens when there is an exception?", "qubi handles most exceptions autonomously using AI-powered escalation logic. Cases requiring human judgment are routed to the right person with full context - no manual triage needed."],
  ["How do you measure success?", "We measure success by the business outcomes defined in your SOW - processing time reduction, cost savings, accuracy improvement, and throughput increase. Every client has a custom outcome dashboard."],
];

const Pricingpage = () => {
  const { metadata, jsonLD, loading: seoLoading } = useSEO({
    path: "/pricing",
    fallbackTitle: "Pricing | Qubi Flow Orchestrator",
    fallbackDescription:
      "Explore outcome-based pricing options for Qubi Flow Orchestrator.",
  });

  const [videoOpen, setVideoOpen] = useState(false);
  const [activePlan, setActivePlan] = useState("enterprise");
  const [compareOpen, setCompareOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const selectedPlan =
    plans.find((plan) => plan.id === activePlan)?? plans[1];

  if (seoLoading) {
    return <div className="pricing-page-loading">Loading...</div>;
  }

  return (
    <div className="pricing-page qubi-landing">
      <SEOHead metadata={metadata} jsonLD={jsonLD} />
      <Nav onOpenVideo={() => setVideoOpen(true)} />

      <header className="pricing-hero">
        <div className="pricing-shell pricing-hero-copy">
          <span className="pricing-eyebrow">Outcome-Based Pricing</span>
          <h1>
            You pay for <em>work completed,</em>
            <br />
            not licenses consumed
          </h1>
          <p>
            qBotica is a managed service, not a software subscription. We run
            your operations end-to-end and charge based on outcomes delivered.
          </p>
        </div>
      </header>

      <section id="plans" className="pricing-section pricing-plans">
        <div className="pricing-shell">
          <div className="pricing-section-head">
            <div>
              <span className="pricing-eyebrow">Plans</span>
              <h2>
                Execution programs
                <br />
                for every scale
              </h2>
            </div>
            
          </div>

          <div className="plan-explorer">
            <aside className="plan-nav">
              <div className="plan-nav-label">Choose a program</div>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={`plan-tab ${plan.id === activePlan? "active" : ""}`}
                  onClick={() => setActivePlan(plan.id)}
                >
                  <small>{plan.kicker}</small>
                  <strong>{plan.title}</strong>
                  <span>
                    {plan.id === "starter"? "Single workflow" : plan.id === "enterprise"? "Multi-workflow" : "Transformational initiative"}
                  </span>
                  {plan.popular && <em className="popular">Most Popular</em>}
                </button>
              ))}
            </aside>

            <article className="plan-content">
              <div className="plan-copy">
                <span className="plan-kicker">{selectedPlan.kicker}</span>
                <h3>{selectedPlan.title}</h3>
                <p className="plan-desc">{selectedPlan.desc}</p>
                <ul className="feature-list">
                  {selectedPlan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="plan-actions">
                  <a className="pricing-btn pricing-btn-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">
                    {selectedPlan.cta}
                  </a>
                  <button className="pricing-btn compare-plans-btn" type="button" onClick={() => setCompareOpen(true)}>
                    Compare plans ↗
                  </button>
                </div>
              </div>
              <aside className="plan-side">
                <p className="plan-side-mini">Choose the execution model that matches the scale and complexity of your operation.</p>
                <div className="plan-callout">
                  <small>Best fit</small>
                  <strong>{selectedPlan.fit}</strong>
                  <p>{selectedPlan.fitCopy}</p>
                </div>
              </aside>
            </article>
          </div>
        </div>
      </section>

      <section id="engine" className="pricing-section pricing-engine">
        <div className="pricing-shell">
          <div className="engine-grid">
            <div className="engine-intro">
              <span className="pricing-eyebrow">The Execution Engine</span>
              <h2>Platform Components</h2>
              <p>Not standalone products. Components of one execution engine, working together to run your operations.</p>
            </div>
            <div className="component-grid">
              {[
                ["▣", "DocumentAI", "Intelligent document processing that reads, extracts, and validates at scale."],
                ["✦", "AI Agents", "Autonomous agents that make decisions and take action within your workflows."],
                ["⚙", "Workflow Automation", "End-to-end process orchestration that connects every step."],
                ["↔", "Orchestration", "Enterprise-grade coordination across systems, teams, and exceptions."],
              ].map(([icon, title, description]) => (
                <article className="component-card" key={title}>
                  <div className="component-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="execution-panel">
            <h3>AI is not the problem. <em>Execution is.</em></h3>
            <p>Most enterprise AI promises intelligence. But intelligence without action is just another dashboard.</p>
            <div className="execution-cards">
              {[
                ["Analyzes but does not act", "Insight-only tools generate dashboards while your team still executes manually. AI that never acts is not reducing your workload."],
                ["Assists but does not complete", "Copilots and assistants help, but they do not finish the job. Someone still has to validate, correct, and push through every system."],
                ["Sits outside operations", "Disconnected from your systems. Disconnected from your workflows. Disconnected from where the actual work happens."],
              ].map(([title, description]) => (
                <article className="execution-card" key={title}>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <div className="execution-note">
              <div>
                <strong>qBotica does not sell intelligence. <span>We sell execution.</span></strong>
                <small>Stop managing AI projects. Start getting work done.</small>
              </div>
              <div className="manifesto-tag">Outcome first</div>
            </div>
          </div>
        </div>
      </section>

      <section id="compare" className="pricing-section pricing-compare">
        <div className="pricing-shell">
          <div className="pricing-section-head compare-head">
            <div>
              <span className="pricing-eyebrow">Comparison</span>
              <h2>Why qBotica, not workflow tools?</h2>
            </div>
          </div>
          <div className="compare-box">
            <div className="compare-row compare-header">
              <div>Aspect</div><div>Workflow Automation Tools</div><div>qubi</div>
            </div>
            {[
              ["AI Role", "Optional add-on", "Core decision engine"],
              ["Document Processing", "Requires separate tools", "Built-in DocumentAI"],
              ["Delivery Model", "You build and operate", "We design and run (managed)"],
              ["Success Metric", "Task completion", "Business outcomes"],
              ["Exception Handling", "Manual intervention", "AI-powered escalation"],
              ["Pricing Model", "Per-seat or per-task licenses", "Outcome-based"],
            ].map(([aspect, them, us]) => (
              <div className="compare-row" key={aspect}>
                <div className="aspect">{aspect}</div><div>{them}</div><div>{us}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

<section id="faq" className="pricing-section pricing-faq">
  <div className="pricing-shell faq-wrap">
    <div className="faq-copy">
      <span className="pricing-eyebrow">FAQ</span>
      <h2>Common questions</h2>
    </div>

    <div className="accordion">
      {faqs.map(([question, answer], index) => {
        const open = openFaq === index;
        return (
          <div className={`faq-item ${open ? "open" : ""}`} key={question}>
            <button
              className="faq-question"
              type="button"
              onClick={() => setOpenFaq(open ? -1 : index)}
            >
              <span>{question}</span>
              <span>{open ? "×" : "+"}</span>
            </button>
            {open && <div className="faq-answer">{answer}</div>}
          </div>
        );
      })}
    </div>
  </div>

  {/* Learn more cross-link — matches the customers-page qBotica bridge */}
  <div className="pricing-shell">
    <section className="pricing-bridge">
      <div className="bridge-box">
        <div className="bridge-copy">
          <img src={qubiCube} alt="qubi" className="bridge-logo" />
          <div>
            <h3>
              Powered by <span className="bridge-qbotica-text">qBotica</span>
            </h3>
            <p>Want to know more about the company behind qubi and our enterprise automation work?</p>
          </div>
        </div>
        <a className="pricing-btn pricing-btn-dark" href="https://www.qbotica.com/" target="_blank" rel="noreferrer">
          Learn more about qBotica ↗
        </a>
      </div>
    </section>
  </div>
  </section>


      <section id="contact" className="pricing-cta">
        <div className="pricing-shell">
          <div className="cta-box">
            <div>
              <h2>Get a custom proposal<br />for your workflow</h2>
              <p>Every engagement starts with a 30-minute discovery call. We will scope your workflow, define success metrics, and provide a tailored proposal.</p>
            </div>
            <div className="cta-actions">
              <a className="pricing-btn pricing-btn-light" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a Discovery Call ↗</a>
              <a className="pricing-btn pricing-btn-dark" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Talk to an Expert</a>
            </div>
          </div>
        </div>
      </section>

      <QubiFooter />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      {compareOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setCompareOpen(false); }}>
          <div className="plan-modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div><span className="pricing-eyebrow">Plan comparison</span><h3>Compare execution programs</h3></div>
              <button className="modal-close" type="button" aria-label="Close comparison" onClick={() => setCompareOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="plan-compare-grid">
                {[["Aspect", "Starter Execution", "Enterprise Execution", "Custom Program"],...comparisonRows].map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div key={`${rowIndex}-${cellIndex}`} className={`pcell ${rowIndex === 0? cellIndex === 0? "head" : "plan-head" : cellIndex === 0? "head" : cell === "—"? "muted" : "yes"}`}>{cell}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricingpage;