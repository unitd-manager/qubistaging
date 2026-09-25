import { useState } from "react";
import "../qubi-landing/qubi-landing.css";
import "./Platformpage.css";
import Nav from "../qubi-landing/Nav";
import QubiFooter from "../qubi-landing/QubiFooter";
import VideoModal from "../qubi-landing/VideoModal";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import qubiLogo from "@/assets/qubi-logo.png";
type Capability = {
  cat: string;
  tag: string;
  title: string;
  text: string;
  details: string[];
};

const data: Capability[] = [
  { cat: "Build & Intelligence", tag: "Build", title: "AgentHub / AI Builder", text: "A visual IDE for chat agents, voice agents, and agentic workflows. Design agents with governance guardrails, evaluations, and model fallback built in, then chain them into workflows with variables and versions.", details: ["Chat & voice agents on their own runtime", "Model-agnostic; credentials encrypted at rest", "Skills & MCP servers for external tools", "RAG sources chunked and embedded", "Jobs, queues & triggers on demand or scheduled", "Memory & vaults for encrypted continuity"] },
  { cat: "Govern & Manage", tag: "Govern", title: "Qubi Platform", text: "Secure authentication, access management, and the launcher for everything. Single sign-on with one directory of people and role-based access applied across the platform.", details: ["Single sign-on with claims kept server-side", "User profiles unified across products", "Roles & permissions granular per product", "Organizations & tenants with isolated data", "Organization units scope what each person sees", "Product catalog & signed licensing"] },
  { cat: "Build & Intelligence", tag: "Automate", title: "Automation Studio", text: "Low-code, drag-and-drop automation building. Compose end-to-end automations visually without heavy engineering, and hand them off to run on the platform.", details: ["Drag-and-drop builder", "Reusable automation components", "No deep coding required"] },
  { cat: "Govern & Manage", tag: "Orchestrate", title: "Control Hub", text: "Centralized orchestration and monitoring. Run, schedule, and observe every automation and agent from one operational control plane.", details: ["Centralized orchestration", "Real-time monitoring", "Single pane of control"] },
  { cat: "Automate & Execute", tag: "Execute", title: "Bot Agents", text: "Digital workers for attended and unattended work. Deploy bots that carry out repetitive, rules-based tasks alongside people or fully in the background.", details: ["Attended & unattended modes", "Repetitive work offloaded", "Scales with demand"] },
  { cat: "Connect & Orchestrate", tag: "Connect", title: "Integration Hub", text: "Third-party APIs, connections, and data sync. Wire qubi into the systems you already run so work flows between them without manual keying.", details: ["Third-party API connections", "Data sync across systems", "Prebuilt & custom connectors"] },
  { cat: "Connect & Orchestrate", tag: "Act", title: "Action Hub", text: "Business users act directly on a workflow. Give non-technical teams a place to review, approve, and push work forward without leaving the platform.", details: ["Business-user friendly", "Act directly on live workflows", "Human decisions in the loop"] },
  { cat: "Discover & Improve", tag: "Discover", title: "Idea Hub", text: "Automation ideas, assessment, and ROI. Capture candidate processes, score them, and prioritize what to automate next by expected return.", details: ["Idea capture & pipeline", "Automation assessment", "ROI prioritization"] },
  { cat: "Discover & Improve", tag: "Measure", title: "Analytics Hub", text: "Performance dashboards and ROI measurement. Track execution, throughput, and value delivered across the platform from one analytics layer.", details: ["Performance dashboards", "ROI measurement", "Cross-product visibility"] },
  { cat: "Operate & Support", tag: "Support", title: "Support Hub", text: "Ticketing and incident management. Raise, route, and resolve issues across the platform so operations keep moving.", details: ["Ticketing built in", "Incident management", "Faster resolution"] },
];

const groups = [
  "Build & Intelligence",
  "Automate & Execute",
  "Connect & Orchestrate",
  "Govern & Manage",
  "Discover & Improve",
  "Operate & Support",
];

export default function Platformpage() {
  useSEO({ title: "Qubi Platform | One Platform Built to Expand", description: "Explore qubi Platform" });

  const [selected, setSelected] = useState(0);
  const [openGroups, setOpenGroups] = useState<string[]>([data[0].cat]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const selectedItem = data[selected];
  const toggleGroup = (group: string) => {
    const isCurrentlyOpen = openGroups.includes(group);
    if (!isCurrentlyOpen) {
      const firstIndexInGroup = data.findIndex(item => item.cat === group);
      if (firstIndexInGroup !== -1) {
        setSelected(firstIndexInGroup);
      }
      setOpenGroups([group]);        // <- ippo array la idhe group mattum, matha ellam auto close
    } else {
      setOpenGroups([]);             // <- same group click pannina close aagum
    }
  };
  
  return (
    <div className="qubi-landing">
      <SEOHead />
      <Nav onOpenVideo={() => setIsVideoOpen(true)} />
      <VideoModal open={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      <div className="platform-page">
        <header className="platform-hero platform-interior-hero">
          <div className="platform-shell">
            <span className="platform-eyebrow">The qubi Platform</span>
            <h1>One platform. <em>Built to expand.</em></h1>
            <p>Bring AI agents, automation, orchestration, integrations, human decisions, analytics, and governance into one connected environment — and add capabilities as your operation grows.</p>
          </div>
        </header>

        <div className="platform-proof">
          <div className="platform-shell platform-proof-grid">
            <div><p>A growing platform designed to let teams start where they need and expand without rebuilding the foundation.</p></div>
            <div><b>One</b><span>shared identity</span></div>
            <div><b>Flexible</b><span>capability adoption</span></div>
            <div><b>Connected</b><span>enterprise execution</span></div>
          </div>
        </div>

        <section className="platform-section platform-story">
          <div className="platform-shell platform-story-grid">
            <div className="platform-story-copy">
              <span className="platform-eyebrow">How it fits together</span>
              <h2>Start with what you need. <em>Expand from there.</em></h2>
              <p>The platform is designed so teams can adopt individual capabilities, connect them through a common foundation, and add more as their automation and AI programs mature.</p>
            </div>
            <div className="platform-flow">
              {[
                ["Sign in", "Move across the platform through a shared identity and access model."],
                ["Adopt", "Begin with the capability that solves the immediate operational need."],
                ["Connect", "Bring agents, automations, systems, data, and human decisions into the same operating environment."],
                ["Govern", "Manage users, roles, permissions, organizations, and access from a shared foundation."],
                ["Expand", "Add new platform capabilities as teams, workflows, and use cases grow."],
              ].map(([title, text]) => (
                <div className="platform-flow-row" key={title}><b>{title}</b><span>{text}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="platform-section platform-explore-section" id="explore">
          <div className="platform-shell">
            <div className="platform-head">
              <span className="platform-eyebrow">Explore the Platform</span>
              <h2>Explore qubi by <em>capability.</em></h2>
              <p>Select a capability area on the left to explore the products and functions available across the platform.The structure can continue to grow as new capabilities are introduced.</p>
            </div>
            <div className="platform-explorer">
              <aside className="platform-capability-side">
                <div className="platform-side-label">Platform capabilities</div>
                {groups.map((group) => {
                  const matches = data.map((item, index) => ({ item, index })).filter(({ item }) => item.cat === group);
                  const isOpen = openGroups.includes(group);
                  return (
                    <div className={`platform-capability-group ${isOpen? "open" : ""}`} key={group}>
                      <button type="button" className="platform-group-toggle" onClick={() => toggleGroup(group)}><span>{group}</span><span className="platform-chev">›</span></button>
                      {isOpen && (
                        <div className="platform-group-items">
                          {matches.map(({ item, index }) => (
                            <button type="button" key={item.title} className={`platform-cap-item ${index === selected? "active" : ""}`} onClick={() => setSelected(index)}>{item.title}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </aside>
              <article className="platform-capability-detail">
                <div>
                  <div className="platform-detail-over">{selectedItem.cat} · {selectedItem.tag}</div>
                  <h3>{selectedItem.title}</h3>
                  <p>{selectedItem.text}</p>
                  <div className="platform-detail-heading">Key capabilities</div>
                  <div className="platform-detail-list">
                    {selectedItem.details.map((detail) => <div className="platform-detail" key={detail}>{detail}</div>)}
                  </div>
                </div>
                <div className="platform-detail-foot">
                  <span>Part of the connected qubi platform ecosystem</span>
                 
<span className="platform-foot-brand">
    <img src={qubiLogo} alt="qubi" className="platform-foot-logo" />
    Platform
  </span>



                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="platform-section platform-foundation">
          <div className="platform-shell">
            <div className="platform-head platform-head-center">
              <span className="platform-eyebrow">Platform Foundation</span>
              <h2>The layers that keep everything <em>connected.</em></h2>
              <p>The platform is more than a catalog of products. Shared intelligence, identity, governance, and operational control give each capability a common foundation.</p>
            </div>
            <div className="platform-foundation-grid">
              <article className="platform-foundation-card dark">
                <span className="platform-eyebrow">Intelligence & Agent Foundation</span>
                <h3>AgentHub / AI Builder</h3>
                <p>A visual environment for chat agents, voice agents, and agentic workflows, with governance guardrails, evaluations, model fallback, RAG, tools, jobs, queues, triggers, memory, and encrypted continuity.</p>
                <div className="platform-mini">
                  <div><span>Models</span>Model-agnostic execution</div>
                  <div><span>Knowledge</span>RAG sources + retrieval</div>
                  <div><span>Tools</span>Skills + MCP servers</div>
                  <div><span>Operations</span>Jobs, queues + triggers</div>
                </div>
              </article>
              <article className="platform-foundation-card">
                <span className="platform-eyebrow">Identity & Governance Foundation</span>
                <h3>Qubi Platform</h3>
                <p>Secure authentication, access management, and the launcher for the platform — one directory of people with role-based access and tenant-aware governance.</p>
                <div className="platform-mini">
                  <div><span>Identity</span>OpenID Connect + OAuth 2.0</div>
                  <div><span>Access</span>Roles + permissions</div>
                  <div><span>Structure</span>Organizations + tenants</div>
                  <div><span>Catalog</span>Products + licensing</div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="platform-section platform-scale">
          <div className="platform-shell platform-scale-grid">
            <div>
              <span className="platform-eyebrow">Designed to Grow</span>
              <h2>Not a fixed suite.<br /><em>An expandable platform.</em></h2>
              <p>qubi does not need to be defined by a fixed number of products. New capabilities can join the same ecosystem while the customer experience — identity, governance, connections, and operations — stays consistent.</p>
            </div>
            <div className="platform-ladder">
              {[
                ["01", "Start focused", "Adopt the capability that addresses the immediate need."],
                ["02", "Connect the work", "Link enterprise systems, agents, automation, and people."],
                ["03", "Govern centrally", "Apply shared identity, roles, access, and operational visibility."],
                ["04", "Expand continuously", "Add capabilities and use cases without redesigning the platform foundation."],
              ].map(([number, title, text]) => (
                <div className="platform-rung" key={number}><b>{number}</b><div><strong>{title}</strong><span>{text}</span></div></div>
              ))}
            </div>
          </div>
        </section>


        <section className="platform-section platform-bridge">
          <div className="platform-shell platform-bridge-grid">
            <div>
              <span className="platform-eyebrow">Platform + Solutions</span>
              <h2>See what the platform can put to work.</h2>
              <p>The Platform page explains what qubi is made of. The Solutions page shows how those capabilities come together across real workflows and industries.</p>
            </div>
            <div className="platform-bridge-actions">
              <a className="platform-btn platform-orange" href="/solutions">Explore Solutions →</a>
              <a className="platform-btn platform-watch platform-bridge-watch" onClick={() => setIsVideoOpen(true)}>Watch the Demo</a>
            </div>
          </div>
        </section>

        
        <section className="platform-cta" id="demo">
          <div className="platform-shell">
            <h2>Build from where you are.</h2>
            <p>Explore the qubi platform with your current workflows in mind, then expand the environment as your automation and AI needs grow.</p>
            <a className="platform-btn platform-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank">Book a Platform Walkthrough →</a>
          </div>
        </section>
      </div>
      <QubiFooter />
    </div>
  );
}