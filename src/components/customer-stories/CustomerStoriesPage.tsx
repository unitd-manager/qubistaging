import "./CustomerStories.css";
import qubiLogo from "@/assets/qubi-logo1.png";
import CustomerNav from "./CustomerNav";
import Hero from "./Hero";
import StoryExplorer from "./StoryExplorer";
import WhyQubi from "./WhyQubi";
import QboticaBridge from "./QboticaBridge";
import Cta from "./Cta";
export default function CustomerStoriesPage() { return <div className="customer-stories-page"><CustomerNav /><Hero /><StoryExplorer /><WhyQubi /><QboticaBridge /><Cta /><footer className="cs-footer"><div className="cs-shell cs-footer-row"><a className="cs-brand" href="#top"><img src={qubiLogo} alt="qubi" className="cs-brand-logo" /><small>Powered by<br />qBotica</small></a><div className="cs-footer-links"><a href="#">Platform</a><a href="#stories">Customers</a><a href="#">Privacy</a><a href="#">qBotica.com ↗</a></div></div></footer></div>; }