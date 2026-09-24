import "../qubi-landing/qubi-landing.css"; // 1st - Nav ku
import "./Solutionpage.css"; // 2nd - Solutions ku
import { useState } from "react";
import Nav from "../qubi-landing/Nav";
import QubiFooter from "../qubi-landing/QubiFooter";
import VideoModal from "../qubi-landing/VideoModal";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";

type UseCase = {
  cat: string;
  title: string;
  text: string;
  results: string[];
};

const usecases: UseCase[] = [
  { cat: "Financial Services", title: "Invoice Processing & ERP Posting", text: "From document intake to validated ERP posting with zero manual touch. AI reads invoices, validates against POs, resolves exceptions, and posts — end-to-end.", results: ["21 days → 2 days processing", "95% accuracy", "$2M annual savings"] },
  { cat: "Healthcare & Insurance", title: "Claims Intake to Adjudication", text: "End-to-end claims processing with AI-driven decisions. Extract claim data, validate against policy rules, route complex cases, and adjudicate — automatically.", results: ["60% reduction in processing time", "3x throughput increase", "98% accuracy"] },
  { cat: "Shared Services", title: "Order-to-Cash Workflows", text: "From order capture to cash reconciliation, fully executed. qubi orchestrates order validation, fulfillment triggers, invoicing, and payment matching across systems.", results: ["Manual data entry eliminated", "50% faster O2C cycle", "99.2% accuracy"] },
  { cat: "Finance & Accounting", title: "Financial Reconciliation", text: "Cross-system matching, exception handling, and reporting. Done. AI agents compare ledgers, flag discrepancies, and close the books without your team pulling all-nighters.", results: ["Month-end close accelerated", "Exceptions auto-resolved", "Full audit trail"] },
  { cat: "Customer Operations", title: "Customer Onboarding", text: "Document collection, verification, and system setup, automated completely. New customers go from application to active in hours, not days.", results: ["Onboarding time cut by 70%", "Zero manual data entry", "Compliance enforced automatically"] },
  { cat: "Cross-Industry", title: "Document-Heavy Decision Workflows", text: "Complex multi-document processes with intelligent routing. Contracts, applications, reports — qubi reads them, extracts what matters, and routes to the right action.", results: ["Any document type supported", "AI extracts structured data", "Decisions in minutes not days"] },
  { cat: "Supply Chain & Logistics", title: "Supply Chain Document Processing", text: "Automate document processing and system updates across the supply chain. Bills of lading, shipping manifests, customs documents — processed and posted automatically.", results: ["Processing time from days to hours", "Zero manual keying", "Real-time visibility"] },
  { cat: "Healthcare", title: "Prior Authorization Workflows", text: "Automate prior authorization workflows end-to-end. Extract clinical data, validate against payer rules, submit and track — with AI handling the complexity.", results: ["Auth turnaround from days to hours", "Denial rates reduced", "Clinical staff freed up"] },
];

const industries = [
  { t: "Financial Services", d: "AI-driven execution for the workflows that power financial operations, from invoice reconciliation to compliance reporting.", w: ["Close the books faster with AI-driven reconciliation", "Process invoices end-to-end without manual bottlenecks", "Automate three-way matching and exception handling", "Continuous invoice processing at scale"] },
  { t: "Healthcare and Insurance", d: "Handle the complexity of healthcare workflows with AI agents that understand clinical data, payer rules, and compliance requirements.", w: ["Process claims end-to-end without human bottlenecks", "Automate prior authorization workflows", "AI-driven eligibility verification", "Denial management and appeals automation"] },
  { t: "Shared Services and Operations", d: "Unify fragmented operations across shared service centers with AI orchestration that connects every system and every step.", w: ["Automate order-to-cash across systems", "Extract, validate, and act on financial data in minutes", "HR document processing and onboarding", "Cross-system reconciliation and reporting"] },
  { t: "Supply Chain and Logistics", d: "Keep goods moving with AI that processes shipping documents, updates systems, and handles exceptions without human bottlenecks.", w: ["Automate document processing and system updates", "Reduce processing time from days to hours", "Bills of lading and customs document automation", "Freight invoice processing and matching"] },
  { t: "Accounts Payable and Procurement", d: "Transform AP from a cost center into a strategic advantage with AI execution that handles the entire invoice lifecycle.", w: ["Three-way matching and exception handling", "Continuous invoice processing at scale", "Vendor onboarding and compliance checks", "Early payment discount capture"] },
  { t: "Customer Operations", d: "Deliver better customer experiences by automating the back-office work that backs every customer interaction.", w: ["Automate customer onboarding workflows", "Reduce manual data entry and system updates", "Contract processing and activation", "Customer document verification at scale"] },
];

export default function SolutionPage() {
  useSEO({ title: "qubi Solutions | Real Work Executed End-to-End", description: "Explore workflows where qubi brings documents, decisions, systems and actions together." });
  const [selected, setSelected] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const active = usecases[selected];

  return (
    <div className="qubi-landing"> {/* ITHU THAAN FIX DA - qubi-solutions-root ah remove panniten */}
      <SEOHead />
      <Nav onOpenVideo={() => setIsVideoOpen(true)} />
      <VideoModal open={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      <div className="solutions-page">
        <header className="sol-hero">
          <div className="sol-shell">
            <span className="sol-ey">Solutions</span>
            <h1>Real work. <em>Executed end-to-end.</em></h1>
            <p>Explore the workflows and operational areas where qubi brings documents, decisions, systems, and actions together to deliver measurable outcomes.</p>
          </div>
        </header>

        <div className="sol-proof">
          <div className="sol-shell sol-proof-grid">
            <div><p>Not demos. Not isolated tasks. Real operational workflows designed around completed work.</p></div>
            <div><b>85%</b><span>Reduction in processing time</span></div>
            <div><b>10x</b><span>Increase in throughput</span></div>
            <div><b>99.2%</b><span>Accuracy rate achieved</span></div>
          </div>
        </div>

        <section className="sol-section sol-usecases">
          <div className="sol-shell">
            <div className="sol-head">
              <span className="sol-ey">Use Cases</span>
              <h2>Start with the work you need to <em>improve.</em></h2>
              <p>Explore real workflows qubi can execute end-to-end, from intake and decision-making through system action and completion.</p>
            </div>

            <div className="sol-uc-layout">
              <div className="sol-uc-cards">
                {usecases.map((x, i) => (
                  <button key={x.title} className={`sol-uc-card ${i === selected ? "active" : ""}`} onClick={() => setSelected(i)}>
                    <small>{x.cat}</small>
                    <h3>{x.title}</h3>
                  </button>
                ))}
              </div>

              <article className="sol-uc-detail">
                <div>
                  <div className="sol-over">{active.cat}</div>
                  <h3>{active.title}</h3>
                  <p>{active.text}</p>
                </div>
                <div className="sol-results">
                  {active.results.map((r) => <div key={r} className="sol-result">{r}</div>)}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sol-section sol-industries">
          <div className="sol-shell">
            <div className="sol-head center">
              <span className="sol-ey">Industries & Operations</span>
              <h2>Built around the work your teams <em>already run.</em></h2>
              <p>The same execution model can support different operational needs across industries and enterprise functions.</p>
            </div>
            <div className="sol-industry-grid">
              {industries.map((x) => (
                <article key={x.t} className="sol-industry">
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                  {x.w.map((v) => <div key={v} className="sol-work">{v}</div>)}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sol-section sol-execution">
          <div className="sol-shell sol-exec-grid">
            <div>
              <span className="sol-ey">How qubi Executes</span>
              <h2>From input to <em>outcome.</em></h2>
              <p>This page focuses on what happens to the work. For the agents, automation, orchestration, integrations, governance, and other capabilities behind it, explore the qubi Platform.</p>
            </div>
            <div className="sol-steps">
              <div className="sol-step"><b>Documents</b><span>Ingest and understand invoices, claims, contracts, financials, and other business documents.</span></div>
              <div className="sol-step"><b>Decisions</b><span>Apply AI, rules, and business context to determine what should happen next.</span></div>
              <div className="sol-step"><b>Actions</b><span>Execute across the enterprise systems involved in the workflow.</span></div>
              <div className="sol-step"><b>Outcomes</b><span>Complete, verify, and deliver the work end-to-end.</span></div>
            </div>
          </div>
        </section>

        <section className="sol-section sol-diff">
          <div className="sol-shell">
            <div className="sol-head">
              <span className="sol-ey">The Business Difference</span>
              <h2>Most AI assists. <em>qubi executes.</em></h2>
              <p>Many tools stop at analysis or assistance. qubi is designed around completing operational work across the systems and decisions involved.</p>
            </div>
            <div className="sol-compare">
              <div className="sol-col">
                <div className="sol-col-title">Traditional approach</div>
                <div className="sol-compare-row">Analyze data</div>
                <div className="sol-compare-row">Assist users</div>
                <div className="sol-compare-row">Require teams to execute</div>
                <div className="sol-compare-row">Sit outside workflows</div>
              </div>
              <div className="sol-col">
                <div className="sol-col-title">qubi</div>
                <div className="sol-compare-row">Executes work</div>
                <div className="sol-compare-row">Completes processes</div>
                <div className="sol-compare-row">Owns outcomes</div>
                <div className="sol-compare-row">Operates inside systems</div>
              </div>
            </div>
          </div>
        </section>

        <section className="sol-section sol-bridge">
          <div className="sol-shell">
            <div className="sol-bridgebox">
              <div>
                <span className="sol-ey">Explore the Platform</span>
                <h2>See what powers every qubi solution.</h2>
                <p>Explore the agents, automation, orchestration, integrations, governance, analytics, and other capabilities that make end-to-end execution possible.</p>
              </div>
              <a href="/platform" className="sol-btn sol-orange">Explore the qubi Platform →</a>
            </div>
          </div>
        </section>

        <section className="sol-cta">
          <div className="sol-shell">
            <h2>Don't see your workflow?</h2>
            <p>We work across operations where documents, decisions, and system actions need to happen together. Tell us what your team needs to execute.</p>
            <a href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer" className="sol-btn sol-orange">Book a Demo →</a>
          </div>
        </section>
      </div>
      <QubiFooter />
    </div>
  );
}