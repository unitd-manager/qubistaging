import qubiLogo from "@/assets/qubi-logo-right.svg";

const QubiFooter = () => {
  return (
    <footer>
      <div className="site-shell">
        <div className="footer-grid">
          <div className="footer-intro">
            <a className="brand" href="#top">
              <div className="brand-logo-wrap">
                <img src={qubiLogo} alt="qubi" className="brand-mark" />
                <div className="brand-line"></div>
                <div className="powered-by">POWERED BY QBOTICA</div>
              </div>
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
            <a href="/customers">Customers</a>
            <a href="https://meetings.hubspot.com/enterprisedemo/qubi-consultation" target="_blank" rel="noreferrer">Book a demo</a>
          </div>
        </div>
        <div className="copyright">
          <span>© 2026 qubi by Qbotica.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default QubiFooter;
