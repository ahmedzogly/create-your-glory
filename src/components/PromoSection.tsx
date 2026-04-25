import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectsMarquee } from "./ProjectsMarquee";
import type { Project } from "@/hooks/use-site-data";

interface Props {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  projects: Project[];
}

export const PromoSection = ({ title, subtitle, ctaText, ctaLink, projects }: Props) => (
  <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-card/30 to-background">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(174,72%,52%,0.08),transparent_60%)]" />
    <div className="container max-w-5xl px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-block section-divider mb-6 mx-auto" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">{title}</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{subtitle}</p>
        <Button asChild size="lg" className="rounded-full px-8">
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </motion.div>
    </div>

    {/* Marquee — half page wide on desktop, full on mobile */}
    <div className="mx-auto w-full md:w-1/2">
      <ProjectsMarquee projects={projects} />
    </div>
  </section>
);
