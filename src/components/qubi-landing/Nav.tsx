import qubiLogo from "@/assets/qubi-logo-right.svg";

interface NavProps {
  onOpenVideo: () => void;
}

const Nav = ({ onOpenVideo }: NavProps) => {
  return (
    <div className="nav-wrap">
      <nav className="nav">

        {/* Logo */}
        <a className="brand" href="#top">
          <div className="brand-logo-wrap">
            <img
              src={qubiLogo}
              alt="qubi"
              className="brand-mark"
            />

            <div className="brand-line"></div>

            <div className="powered-by">POWERED BY QBOTICA</div>
          </div>
        </a>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#why">Why qubi</a>
          <a href="#how">How it works</a>
          <a href="#use-cases">Solutions</a>
          <a href="#enterprise">Enterprise</a>
          <a href="/customers">Customers</a>

          <a
            href="https://myqubi.com/pricing"
            target="_blank"
            rel="noreferrer"
          >
            Pricing
          </a>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="nav-watch"
            onClick={onOpenVideo}
          >
            Watch demo
          </button>

          <a
            className="btn btn-orange"
            href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation"
            target="_blank"
            rel="noreferrer"
          >
            Book a demo ↗
          </a>
        </div>

      </nav>
    </div>
  );
};

export default Nav;