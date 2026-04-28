import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useOrbitSkills } from "@/hooks/use-site-data";

interface Props {
  children: React.ReactNode;
}

export const SkillsOrbit = ({ children }: Props) => {
  const { items } = useOrbitSkills();
  const skills = items.length > 0 ? items : [];

  return (
    <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] mx-auto flex items-center justify-center">
      {/* Rotating tech rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-accent/15 border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 55, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-16 rounded-full border border-primary/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      />

      {/* Pulsing glow backdrop */}
      <motion.div
        className="absolute inset-10 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{ maskImage: "radial-gradient(circle, black 60%, transparent 70%)" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/15 to-transparent"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Profile image in center */}
      <div className="relative z-10">{children}</div>

      {/* Orbiting skill labels */}
      {skills.length > 0 && (
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2;
            const radius = 50;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const Icon = (Icons as any)[skill.icon] ?? Icons.Sparkles;
            return (
              <motion.div
                key={skill.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              >
                <motion.div
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-full glass-strong border border-border/50 backdrop-blur-md"
                  whileHover={{ scale: 1.15 }}
                  style={{ boxShadow: `0 0 20px ${skill.color}40` }}
                >
                  <Icon size={16} style={{ color: skill.color }} />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-foreground whitespace-nowrap">
                    {skill.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};
