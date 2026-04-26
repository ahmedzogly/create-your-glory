import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/hooks/use-site-data";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
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

  const categories = useMemo(() => {
    const set = new Set<string>(items.map((p) => p.category || "Other"));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = active === "All" ? items : items.filter((p) => (p.category || "Other") === active);

  return (
    <section id="projects" className="py-24 px-6 scroll-mt-20">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="section-divider mb-6" />
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-muted-foreground mb-8">Hand-picked work across analytics, dashboards and ML.</p>
        </motion.div>

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  active === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
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
              <motion.button
                layout
                key={project.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                custom={i}
                onClick={() => setSelected(project)}
                className="group text-left rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={resolveImage(project.image_url)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground">
                      {project.category || "Other"}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </motion.button>
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
                    View Project <ExternalLink size={16} />
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
