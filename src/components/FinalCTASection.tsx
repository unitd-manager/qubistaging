import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomeSection, stripHtml } from "@/lib/strapi";

const FinalCTASection = () => {
  const { data: section } = useQuery({
    queryKey: ["home-section", "final-cta"],
    queryFn: () => getHomeSection("final-cta"),
    staleTime: 5 * 60 * 1000,
  });

  const a = section?.attributes;
  const heading = a?.section_title ?? "";
  const subheading = stripHtml(a?.description);
  const primaryLabel = a?.display_type ?? "";
  const secondaryLabel = a?.template ?? "";
  const ctaUrl = a?.external_link ?? "";

  return (
    <section className="py-12 lg:py-16 bg-background relative overflow-hidden" id="final-cta">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none opacity-50" />

      <div className="relative container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto">
          {heading.includes("qubi") ? (
            <>
              {heading.split("qubi")[0]}
              <span className="text-gradient">qubi</span>
              {heading.split("qubi")[1]}
            </>
          ) : (
            heading
          )}
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">{subheading}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button asChild variant="hero" size="lg" className="gap-2 px-8 h-12">
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              {primaryLabel} <ArrowRight size={18} />
            </a>
          </Button>
          <Button asChild variant="hero-outline" size="lg" className="gap-2 px-8 h-12">
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              <MessageSquare size={16} /> {secondaryLabel}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
