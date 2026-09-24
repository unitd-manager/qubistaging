import { useState } from "react";
import "./Faqpage.css";
import "../qubi-landing/qubi-landing.css";
import Nav from "../qubi-landing/Nav";
import QubiFooter from "../qubi-landing/QubiFooter";
import VideoModal from "../qubi-landing/VideoModal";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";

type QA = [string, string];
type Category = [string, QA[]];

const sections: Category[] = [
  ["About qubi", [
    ["What is qubi?", "qubi is qBotica's enterprise AI execution platform. It's not a workflow automation tool - it's the engine that orchestrates AI agents, document intelligence, human-in-the-loop workflows, and enterprise system integrations as a unified whole. qBotica operates qubi as a managed service on behalf of enterprise clients."],
    ["Is qubi a low-code platform I can configure myself?", "qubi has a configuration interface, but qBotica doesn't sell it as a self-service platform. We run qubi as a managed service, meaning our execution team configures, monitors, and optimizes your workflows. This eliminates implementation risk and removes the need for an internal AI operations team."],
  ]],
  ["Platform & Technology", [
    ["What is DoqumentAI?", "DoqumentAI is qubi's built-in document intelligence layer. It reads and understands any document type - invoices, claims, contracts, financial statements, shipping manifests - extracting structured data, validating against business rules, and enabling AI agents to make decisions based on what it understands. No separate document processing tool needed."],
    ["What enterprise systems does qubi integrate with?", "qubi has 500+ pre-built connectors covering SAP, Oracle ERP, Salesforce, ServiceNow, Workday, Microsoft Dynamics, and most major enterprise platforms. We also build custom integrations as part of the managed service. If a system has an API or a UI, qubi can interact with it."],
    ["How does human-in-the-loop work?", "qubi routes cases that require human judgment to the right person with full context - no manual triage needed. Humans see what the AI understood, what it decided, and why it flagged the case. Once the human resolves it, qubi learns from the decision and applies that context to future cases."],
  ]],
  ["Implementation & Operations", [
    ["How long does it take to go live?", "Most workflows go live within 6-10 weeks from signed agreement. This includes discovery, process mapping, configuration, testing, and employee change management. Complex multi-system orchestrations may take 12-16 weeks. We provide a detailed timeline during scoping."],
    ["What does the managed service include?", "Our managed service includes: workflow design and configuration, system integration setup, testing and validation, go-live support, 24/7 monitoring and operations, exception management, continuous optimization, and regular business reviews. We own the execution from input to outcome."],
    ["How do you handle process exceptions?", "qubi handles most exceptions autonomously using AI-powered escalation logic - applying business rules, context, and learned patterns to resolve unexpected cases. Cases requiring human judgment are routed automatically with full context. Our team monitors exception rates and refines the AI logic continuously."],
    ["What happens if the AI makes a mistake?", "All AI decisions have a confidence threshold - cases below the threshold are escalated to humans or our operations team before posting. We also run continuous accuracy monitoring and have rollback procedures for any downstream system actions. Every action is logged with a full audit trail."],
  ]],
  ["Pricing & Commercial", [
    ["How is qubi priced?", "qubi operates on an outcome-based model. You pay for work completed, not licenses consumed. Pricing is scoped per workflow based on volume, complexity, and the number of systems involved. We provide a detailed SOW after a discovery session."],
    ["Is there a free trial?", "We don't offer free trials. We do offer a paid pilot on a single workflow with defined success metrics, so you can validate ROI before committing to full deployment."],
    ["What's a typical contract term?", "Most managed service agreements are 12-24 months. This ensures we have the time to deliver meaningful business outcomes and continuously improve the execution. We don't offer short-term licenses - we're built for long-term operational partnership."],
  ]],
  ["About qBotica", [
    ["What is qBotica?", "qBotica is an Enterprise AI Execution Company. We don't just build models or automate tasks - we design and run end-to-end operational execution using AI agents, intelligent automation, and enterprise orchestration. We read complex documents, make decisions using AI + rules + context, execute actions across your enterprise systems, and orchestrate workflows end-to-end, continuously, as a managed service."],
    ["How is qBotica different from software vendors?", "Software vendors sell platforms and licenses. qBotica sells outcomes. We don't hand you a tool and walk away. Our team designs, deploys, operates, and continuously optimizes your AI workflows as a managed service. You focus on business outcomes; we handle all the complexity."],
    ["Is qBotica a consulting company?", "No. We're an execution company. Consultants advise. We execute. Our team runs your operations 24/7, handling documents, decisions, system actions, and exceptions - continuously."],
  ]],
];

const Faqpage = () => {
  const { metadata, jsonLD, loading: seoLoading } = useSEO({
    path: "/resources/faqs",
    fallbackTitle: "FAQs | Qubi Flow Orchestrator",
    fallbackDescription: "Everything you need to know about qubi, how it works, and the team behind it.",
  });

  const [videoOpen, setVideoOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);

  const current = sections[activeSection];

  const selectSection = (i: number) => {
    setActiveSection(i);
    setOpenQuestion(0);
  };

  if (seoLoading) {
    return <div className="faq-page-loading">Loading...</div>;
  }

  return (
    <div className="faq-page qubi-landing">
      <SEOHead metadata={metadata} jsonLD={jsonLD} />
      <Nav onOpenVideo={() => setVideoOpen(true)} />

      <header className="faq-hero">
        <div className="faq-shell">
          <span className="faq-pill">● &nbsp; FAQs</span>
          <h1>
            Questions about qubi, <em>answered.</em>
          </h1>
          <p>Everything you need to know about qubi, how it works, how we run enterprise workflows, and the team behind it.</p>
        </div>
      </header>

      <main className="faq-main">
        <div className="faq-shell faq-layout">
          <aside className="faq-side">
            <div className="faq-label">Browse by topic</div>
            <div className="faq-cats">
              {sections.map(([title, questions], i) => (
                <button
                  key={title}
                  type="button"
                  className={`faq-cat${i === activeSection ? " active" : ""}`}
                  onClick={() => selectSection(i)}
                >
                  {title}
                  <span>
                    {questions.length} {questions.length === 1 ? "question" : "questions"}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section>
            <div className="faq-top">
              <div>
                <small>{current[0]}</small>
                <h2>{current[0]}</h2>
              </div>
              <div className="faq-count">{String(current[1].length).padStart(2, "0")}</div>
            </div>

            <div>
              {current[1].map(([question, answer], i) => {
                const open = i === openQuestion;
                return (
                  <div className={`faq-qa${open ? " open" : ""}`} key={question}>
                    <button
                      className="faq-q"
                      type="button"
                      onClick={() => setOpenQuestion(open ? -1 : i)}
                    >
                      <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="faq-qt">{question}</span>
                      <span className="faq-plus">+</span>
                    </button>
                    {open && <div className="faq-ans">{answer}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <section className="faq-cta">
        <div className="faq-shell faq-cg">
          <div>
            <h2>Still have questions?</h2>
            <p>Our team is happy to answer questions about qubi, your workflow, or how we approach enterprise AI execution.</p>
          </div>
          <div className="faq-actions">
            <a className="faq-btn faq-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">
              Book a Demo →
            </a>
            <a className="faq-btn faq-outline" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">
              Contact Us →
            </a>
          </div>
        </div>
      </section>

      <QubiFooter />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
};

export default Faqpage;