import qubiLogo from "@/assets/qubi-logo1.png";
import qboticaLogo from "@/assets/qbotica-logo.png";

const QubiFooter = () => {
  return (
    <footer>
      <div className="site-shell">
        <div className="footer-grid">
          <div className="footer-intro">
            <a className="brand" href="#top">
              <img src={qubiLogo} alt="qubi" className="brand-mark" />
              <small>by qBotica</small>
              
            </a>
            <p>The agentic orchestration platform connecting AI agents, automations, systems, and people.</p>
          </div>
          <div className="footer-col">
            <strong>Product</strong>
            <a href="#why">Why qubi</a>
            <a href="#how">How it works</a>
            <a href="#enterprise">Built for enterprise</a>
            <a href="https://myqubi.com/pricing" target="_blank" rel="noreferrer">Pricing</a>
          </div>
          <div className="footer-col">
            <strong>Solutions</strong>
            <a href="#use-cases">Operations</a>
            <a href="#use-cases">Finance</a>
            <a href="#use-cases">Human resources</a>
            <a href="#use-cases">IT service mgmt</a>
          </div>
          <div className="footer-col">
            <strong>Company</strong>
            <a href="https://www.qbotica.com/" target="_blank" rel="noreferrer">qBotica ↗</a>
            <a href="https://myqubi.com/customers" target="_blank" rel="noreferrer">Customers</a>
            <a href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo</a>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 qubi by Qbotica. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default QubiFooter;
