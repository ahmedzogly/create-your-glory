import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, FolderKanban, GraduationCap, Award } from "lucide-react";

const Counter = ({ to, duration = 1600 }: { to: number; duration?: number }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}</span>;
};

interface Props {
  experienceCount: number;
  projectsCount: number;
  educationCount: number;
}

export const StatsSection = ({ experienceCount, projectsCount, educationCount }: Props) => {
  const stats = [
    { icon: Briefcase, value: experienceCount, label: "Work Experiences", suffix: "+" },
    { icon: FolderKanban, value: projectsCount, label: "Projects Delivered", suffix: "+" },
    { icon: GraduationCap, value: educationCount, label: "Qualifications", suffix: "" },
    { icon: Award, value: 100, label: "Commitment", suffix: "%" },
  ];

  return (
    <section className="py-20 px-6 border-y border-border/40 bg-card/30">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <s.icon size={22} />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
                <Counter to={s.value} />
                <span className="text-primary">{s.suffix}</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
