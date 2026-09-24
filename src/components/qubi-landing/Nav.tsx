import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // react-router use panra na
import qubiLogo from "@/assets/qubi-logo1.png";
import qboticaLogo from "@/assets/qbotica-logo-trans.png";

interface NavProps {
  onOpenVideo: () => void;
}

const Nav = ({ onOpenVideo }: NavProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home", href: "/" },
    { label: "Customer", href: "/customers" },
    { label: "Pricing", href: "/pricing" },
    { label: "Platform", href: "/platform" }, // FIX 1: /#use-cases -> /platform
    { label: "Solutions", href: "/solutions" }, // FIX 2: /customers#stories -> /solutions
    { label: "FAQs", href: "/faqs" },
  ];

  // Active link set pannu
  useEffect(() => {
    const currentPath = location.pathname;
    const matched = links.find(l => currentPath.startsWith(l.href) && l.href!== "/");
    if (matched) setActiveLink(matched.label);
    else setActiveLink("Home");
  }, [location]);

  // Hash scroll
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [location]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    e.preventDefault(); // ellam namma control la
    setActiveLink(label);
    setIsMobileOpen(false);

    // Hash irukka link ah handle pannu
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (location.pathname === (path || "/")) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      } else {
        navigate(href); // vera page ku pona redirect
      }
    } else {
      navigate(href); // normal page redirect - /platform, /solutions
    }
  };

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a className="brand" href="/" onClick={(e) => handleNavClick(e, "/", "Home")}>
             {/* logo */}
            <div className="brand-logo-wrap">
              <img src={qubiLogo} alt="qubi" className="brand-mark" />
              <div className="brand-divider"></div>
              <div className="powered-by">
                <span className="powered-label">POWERED BY</span>
                <img src={qboticaLogo} alt="qBotica" className="qbotica-wordmark" />
              </div>
            </div>
          </a>
          <div className="nav-links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={activeLink === link.label? "active-orange" : ""}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-watch" onClick={onOpenVideo}>Watch demo</button>
            <a className="btn btn-orange" href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank">Book a demo ↗</a>
            <button className="nav-hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>{isMobileOpen? "✕" : "☰"}</button>
          </div>
        </nav>
      </div>
      {/* mobile menu same */}
    </>
  );
};

export default Nav;