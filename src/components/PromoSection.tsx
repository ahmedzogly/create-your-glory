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
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.1),transparent_50%)]" />
    <div className="container max-w-5xl px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative"
      >
        <div className="inline-flex items-center justify-center mb-6">
          <div className="section-divider" />
        </div>
        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-mono tracking-widest uppercase mb-5">
          ✨ Bespoke Portfolios
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-5 leading-[1.05]">
          <span className="text-gradient-glow animate-gradient bg-gradient-primary">{title}</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{subtitle}</p>
        <Button asChild size="lg" className="rounded-full px-8 bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:shadow-glow hover:opacity-95 transition-all">
          <a href={ctaLink}>{ctaText} →</a>
        </Button>
      </motion.div>
    </div>

    {/* Marquee */}
    <div className="mx-auto w-full md:w-2/3 lg:w-1/2 mask-fade">
      <ProjectsMarquee projects={projects} />
    </div>
  </section>
);
