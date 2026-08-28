import { useState } from "react";
import qubiLogo from "@/assets/qubi-logo.png";

type TabKey = "operations" | "finance" | "hr" | "service" | "it";

const tabs: { key: TabKey; label: string }[] = [
  { key: "operations", label: "Operations" },
  { key: "finance", label: "Finance" },
  { key: "hr", label: "Human Resources" },
  { key: "service", label: "Customer Service" },
  { key: "it", label: "IT Service Management" },
];

const chipLabels: Record<
  TabKey,
  [string, string, string, string, string]
> = {
  operations: ["CRM", "ERP", "HR", "Support", "Cloud"],
  finance: ["ERP", "Invoicing", "Banking", "Procurement", "Reporting"],
  hr: ["HRIS", "Payroll", "Identity", "Docs", "Benefits"],
  service: ["CRM", "Ticketing", "Knowledge", "Chat", "Cloud"],
  it: ["ITSM", "Identity", "Monitoring", "Cloud", "Automation"],
};

const content: Record<
  TabKey,
  { title: string; copy: string; scenario: string }
> = {
  operations: {
    title: "Keep complex operations moving.",
    copy:
      "Coordinate procurement, document processing, approvals, exceptions, and downstream actions across people and systems without losing visibility between steps.",
    scenario:
      "A procurement request arrives, qubi gathers context, validates against policy, routes approvals, updates the ERP, and confirms completion.",
  },

  finance: {
    title: "Automate invoice approvals end to end.",
    copy:
      "Connect document processing, policy checks, approvals, ERP actions, and reporting in one governed workflow reducing delays and improving financial controls.",
    scenario:
      "An invoice is captured, validated against policy and purchase orders, routed for approval, posted, and monitored for exceptions.",
  },

  hr: {
    title: "Streamline employee onboarding.",
    copy:
      "Orchestrate onboarding, access requests, policy questions, approvals, and employee data across HR and IT systems so new hires get what they need on day one.",
    scenario:
      "A new-hire request triggers document collection, system access provisioning, task assignment, manager approvals, and employee communication.",
  },

  service: {
    title: "Automate ticket routing and escalation.",
    copy:
      "Give service teams an agentic layer that understands context, routes tickets, and completes the downstream work required to resolve each request.",
    scenario:
      "qubi interprets the request, checks account history, routes and escalates the ticket, performs permitted actions, and records the outcome.",
  },

  it: {
    title: "Turn IT requests into governed execution.",
    copy:
      "Automate IT service management connect intake with knowledge, ticketing, identity, automation, and human escalation.",
    scenario:
      "qubi diagnoses the issue, retrieves trusted guidance, executes approved remediation, and hands off complex cases with full context.",
  },
};

const UseCases = () => {
  const [active, setActive] = useState<TabKey>("operations");

  const current = content[active];

  return (
    <section className="use-cases section-pad" id="use-cases">
      <div className="site-shell">

        {/* Section heading */}
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Use Cases</div>

            <h2>
              Built around the work your teams already do.
            </h2>
          </div>
        </div>

        {/* Main use-case area */}
        <div className="use-grid reveal">

          {/* Tabs */}
          <div className="use-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`use-tab${
                  active === tab.key ? " active" : ""
                }`}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
                <span>→</span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="use-panel">

            <h3>{current.title}</h3>

            <p>{current.copy}</p>

            {/* Example workflow */}
            <div className="scenario">
              <small>Example workflow</small>

              <p>{current.scenario}</p>
            </div>

            {/* Integration cloud */}
            <div className={`integration-cloud ${active}`}>

              {/* QUBI LOGO */}
              <div className="integration-core">
                <img
                  src={qubiLogo}
                  alt="qubi"
                />
              </div>

              {/* Integration chips */}
              <span className="logo-chip chip-1">
                {chipLabels[active][0]}
              </span>

              <span className="logo-chip chip-2">
                {chipLabels[active][1]}
              </span>

              <span className="logo-chip chip-3">
                {chipLabels[active][2]}
              </span>

              <span className="logo-chip chip-4">
                {chipLabels[active][3]}
              </span>

              <span className="logo-chip chip-5">
                {chipLabels[active][4]}
              </span>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;