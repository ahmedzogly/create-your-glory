import { motion } from "framer-motion";
import type { Project } from "@/hooks/use-site-data";

interface Props {
  projects: Project[];
}

// Resolves both Supabase storage URLs and legacy /src/assets/* paths
const resolveImage = (url: string) => {
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/src/assets/")) {
    // Vite static import via URL constructor
    const filename = url.replace("/src/assets/", "");
    return new URL(`../assets/${filename}`, import.meta.url).href;
  }
  return url;
};

export const ProjectsMarquee = ({ projects }: Props) => {
  if (projects.length === 0) return null;
  // Duplicate list for seamless loop
  const looped = [...projects, ...projects];

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: projects.length * 4, ease: "linear", repeat: Infinity }}
      >
        {looped.map((project, i) => (
          <div
            key={`${project.id}-${i}`}
            className="w-[280px] md:w-[340px] shrink-0 rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={resolveImage(project.image_url)}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{project.title}</h3>
              <p className="text-muted-foreground text-xs line-clamp-2">{project.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
