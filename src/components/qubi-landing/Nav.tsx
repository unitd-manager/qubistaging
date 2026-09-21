import { useState, useEffect } from "react";
import qubiLogo from "@/assets/qubi-logo1.png";
import qboticaLogo from "@/assets/qbotica-logo-trans.png";

interface NavProps {
  onOpenVideo: () => void;
}

const Nav = ({ onOpenVideo }: NavProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  const links = [
    { label: "Home", href: "/" },
    { label: "Customer", href: "/customers" },
    { label: "Pricing", href: "/pricing" },
    { label: "Platform", href: "/#use-cases" },
    { label: "Solutions", href: "/customers#stories" },
    { label: "FAQs", href: "/pricing#faq" },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const fullPath = path + hash;
    const matched = links.find(l => l.href === fullPath || l.href === path);
    if (matched) {
      setActiveLink(matched.label);
    } else if (path === "/" && !hash) {
      setActiveLink("Home");
    }

    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 600);
    }
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    setActiveLink(label);
    setIsMobileOpen(false);

    if (href.includes("#")) {
      const [pathPart, hash] = href.split("#");
      const currentPath = window.location.pathname;
      const normalizedPath = pathPart === "" ? "/" : pathPart;

      if (currentPath === normalizedPath) {
        const el = document.getElementById(hash);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      }
      // Vera page na browser default ah hash oda navigation pannum, useEffect smooth scroll pannum
    }
  };

  const handleLogoClick = () => {
    setActiveLink("Home");
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a className="brand" href="/#top" onClick={handleLogoClick}>
            <div className="brand-logo-wrap">
              <img src={qubiLogo} alt="qubi" className="brand-mark" />
              <div className="brand-divider"></div>
              <div className="powered-by">
                <span className="powered-label">POWERED BY</span>
                <img src={qboticaLogo} alt="qBotica" className="qbotica-wordmark qbotica-nav-wordmark" />
              </div>
            </div>
          </a>
          <div className="nav-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.label)} className={activeLink === link.label ? "active-orange" : ""}>{link.label}</a>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-watch" onClick={onOpenVideo}>Watch demo</button>
            <a className="btn btn-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo ↗</a>
            <button className="nav-hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label="Menu">{isMobileOpen ? "✕" : "☰"}</button>
          </div>
        </nav>
      </div>
      <div className={`mobile-menu ${isMobileOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setIsMobileOpen(false)} aria-label="Close menu">✕</button>
        <div className="mobile-links">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.label)} className={activeLink === link.label ? "active-orange" : ""}>{link.label}</a>
          ))}
        </div>
        <div className="mobile-actions">
          <button className="btn btn-light" onClick={onOpenVideo}>Watch demo</button>
          <a className="btn btn-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo ↗</a>
        </div>
      </div>
    </>
  );
};

export default Nav;