import { useRef, useState } from "react";
import "./qubi-landing.css";
import Nav from "./Nav";
import Hero from "./Hero";
import Ticker from "./Ticker";
import Why from "./Why";
import How from "./How";
import UseCases from "./UseCases";
import Enterprise from "./Enterprise";
import Proof from "./Proof";
import Cta from "./Cta";
import QubiFooter from "./QubiFooter";
import VideoModal from "./VideoModal";
import { useReveal } from "./useReveal";

const QubiLandingPage = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useReveal(containerRef);

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => setVideoOpen(false);

  return (
    <div className="qubi-landing" ref={containerRef}>
      <Nav onOpenVideo={openVideo} />

      <main id="top">
        <Hero onOpenVideo={openVideo} />
        <Ticker />
        <Why />
        <How />
        <UseCases />
        <Enterprise />
        <Proof />
        <Cta onOpenVideo={openVideo} />
      </main>

      <QubiFooter />
      <VideoModal open={videoOpen} onClose={closeVideo} />
    </div>
  );
};

export default QubiLandingPage;
