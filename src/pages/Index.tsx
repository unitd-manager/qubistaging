import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import QubiLandingPage from "@/components/qubi-landing/QubiLandingPage";

const Index = () => {
  const { metadata, jsonLD } = useSEO({
    path: "/",
    fallbackTitle: "qubi — Orchestrate AI Agents, Bots, Systems & People | Enterprise Workflow Automation",
    fallbackDescription:
      "Qubi Flow Orchestrator — a unified enterprise platform for designing, deploying, and managing intelligent workflows powered by AI agents, automation, human input, and enterprise integrations.",
  });

  return (
    <>
      <SEOHead metadata={metadata} jsonLD={jsonLD} />
      <QubiLandingPage />
    </>
  );
};

export default Index;
