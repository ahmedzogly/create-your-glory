import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/hooks/use-site-data";
import { cn } from "@/lib/utils";
import { LiquidSphere } from "@/components/LiquidSphere";
import { useLanguage } from "@/hooks/use-language";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Subtle 3D tilt + spotlight that follows the mouse on each project card
const ProjectCard = ({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [6, -6]);
  const rotateX = useTransform(sy, [0, 1], [-5, 5]);
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${spotX} ${spotY}, hsl(var(--primary) / 0.18), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.button
      ref={ref}
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      custom={index}
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group relative text-left rounded-2xl overflow-hidden glass glow-border transition-shadow duration-300 hover:shadow-glow"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{ background: spotlight }}
      />
      <div className="aspect-video overflow-hidden relative" style={{ transform: "translateZ(20px)" }}>
        <img
          src={resolveImage(project.image_url)}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-mono rounded-full glass-strong text-foreground">
            {project.category || "Other"}
          </span>
        </div>
      </div>
      <div className="p-5 relative" style={{ transform: "translateZ(30px)" }}>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-gradient transition-colors">{project.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{project.description}</p>
      </div>
    </motion.button>
  );
};

const resolveImage = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/src/assets/")) {
    const filename = url.replace("/src/assets/", "");
    return new URL(`../assets/${filename}`, import.meta.url).href;
  }
  return url;
};

export const ProjectsSection = ({ items }: { items: Project[] }) => {
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const { t } = useLanguage();

  const categories = useMemo(() => {
    const set = new Set<string>(items.map((p) => p.category || "Other"));
    return [t.all, ...Array.from(set)];
  }, [items, t.all]);

  const filtered = active === t.all ? items : items.filter((p) => (p.category || "Other") === active);

  return (
    <section id="projects" className="py-24 px-6 scroll-mt-20 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center opacity-70">
        <LiquidSphere className="w-[680px] h-[680px] max-w-[90vw] max-h-[90vw]" />
      </div>
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />

      <div className="container max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="section-divider mb-6" />
          <h2 className="text-3xl font-bold mb-4">{t.projectsTitle}</h2>
          <p className="text-muted-foreground mb-8">{t.projectsSubtitle}</p>
        </motion.div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  active === cat
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-sm"
                    : "glass text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onSelect={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-secondary text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="aspect-video overflow-hidden">
                <img src={resolveImage(selected.image_url)} alt={selected.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
                  {selected.category || "Other"}
                </span>
                <h3 className="text-2xl font-bold mb-3">{selected.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{selected.description}</p>
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                  >
                    {t.viewProject} <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
