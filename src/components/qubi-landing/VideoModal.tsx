import { useEffect, useRef } from "react";
import demoVideo from "@/assets/demo.mp4";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

const VideoModal = ({ open, onClose }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    videoRef.current?.play();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      videoRef.current?.pause();
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`modal${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="qubi product demo"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <strong>qubi platform — full demo</strong>
          <button className="modal-close" aria-label="Close video" onClick={onClose}>×</button>
        </div>
        <div className="video-placeholder" style={{ padding: 0 }}>
          <video
            ref={videoRef}
            style={{ width: "100%", aspectRatio: "16/9", display: "block" }}
            controls
          >
            <source src={demoVideo} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
