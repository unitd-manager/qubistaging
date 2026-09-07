import { useState } from "react";
import "./CustomerStories.css";
import "../qubi-landing/qubi-landing.css";
import Nav from "../qubi-landing/Nav";
import QubiFooter from "../qubi-landing/QubiFooter";
import VideoModal from "../qubi-landing/VideoModal";
import Hero from "./Hero";
import StoryExplorer from "./StoryExplorer";
import WhyQubi from "./WhyQubi";
import QboticaBridge from "./QboticaBridge";
import Cta from "./Cta";

export default function CustomerStoriesPage() {
	const [videoOpen, setVideoOpen] = useState(false);

	return (
		<div className="customer-stories-page qubi-landing">
			<Nav onOpenVideo={() => setVideoOpen(true)} />
			<main>
				<Hero />
				<StoryExplorer />
				<WhyQubi />
				<QboticaBridge />
				<Cta />
			</main>
			<QubiFooter />
			<VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
		</div>
	);
}