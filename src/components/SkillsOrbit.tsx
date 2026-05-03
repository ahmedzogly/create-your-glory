import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import * as Icons from "lucide-react";
import { useOrbitSkills } from "@/hooks/use-site-data";

interface Props {
  children: React.ReactNode;
}

/* ─── Orbit config ─── */
const ORBIT_LAYERS = [
  { radius: 42, duration: 28, direction: 1 },   // inner – fast CW
  { radius: 62, duration: 40, direction: -1 },   // middle – slow CCW
  { radius: 82, duration: 55, direction: 1 },    // outer – slowest CW
];

/* ─── Default skills when DB is empty ─── */
const FALLBACK_SKILLS = [
  { id: "fb1", label: "Python", icon: "Code2", color: "#3b82f6" },
  { id: "fb2", label: "SQL", icon: "Database", color: "#a855f7" },
  { id: "fb3", label: "Power BI", icon: "BarChart3", color: "#f97316" },
  { id: "fb4", label: "Excel", icon: "Table", color: "#22c55e" },
  { id: "fb5", label: "ML", icon: "BrainCircuit", color: "#ec4899" },
  { id: "fb6", label: "Analysis", icon: "TrendingUp", color: "#06b6d4" },
  { id: "fb7", label: "Tableau", icon: "PieChart", color: "#eab308" },
  { id: "fb8", label: "R", icon: "FileCode", color: "#ef4444" },
  { id: "fb9", label: "Statistics", icon: "Calculator", color: "#8b5cf6" },
];

export const SkillsOrbit = ({ children }: Props) => {
  const { items } = useOrbitSkills();
  const skills = items.length > 0 ? items : FALLBACK_SKILLS;
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) * 0.02);
      mouseY.set((e.clientY - cy) * 0.02);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  // Animation tick for SVG lines (60fps loop)
  useEffect(() => {
    if (hovered) return;
    let raf: number;
    const loop = () => { setTick(Date.now()); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  // Distribute skills across orbit layers
  const layers = useMemo(() => {
    const result: { skill: typeof skills[0]; layer: number }[] = [];
    skills.forEach((s, i) => {
      result.push({ skill: s, layer: i % ORBIT_LAYERS.length });
    });
    return result;
  }, [skills]);

  // Compute current positions for SVG lines
  const positions = useMemo(() => {
    const now = tick;
    return layers.map(({ skill, layer }) => {
      const config = ORBIT_LAYERS[layer];
      const idx = layers.filter((l) => l.layer === layer).indexOf(layers.find((l) => l.skill.id === skill.id)!);
      const total = layers.filter((l) => l.layer === layer).length;
      const baseAngle = (idx / total) * Math.PI * 2;
      const elapsed = now / 1000;
      const speed = ((Math.PI * 2) / config.duration) * config.direction;
      const angle = hovered ? baseAngle : baseAngle + elapsed * speed;
      const r = config.radius;
      return {
        x: 50 + r * Math.cos(angle),
        y: 50 + r * Math.sin(angle),
        color: skill.color,
        id: skill.id,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, layers, hovered]);

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ x: springX, y: springY, perspective: 800 }}
      className="relative w-[360px] h-[360px] md:w-[520px] md:h-[520px] lg:w-[580px] lg:h-[580px] mx-auto flex items-center justify-center"
    >
      {/* 3D perspective wrapper */}
      <motion.div
        style={{ rotateX: springY, rotateY: springX }}
        className="absolute inset-0"
      >
        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <defs>
            {positions.map((p) => (
              <linearGradient key={`g-${p.id}`} id={`line-${p.id}`} x1="50%" y1="50%" x2={`${p.x}%`} y2={`${p.y}%`}>
                <stop offset="0%" stopColor={p.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0.05" />
              </linearGradient>
            ))}
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="0.3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {positions.map((p) => (
            <line
              key={`l-${p.id}`}
              x1="50" y1="50"
              x2={p.x} y2={p.y}
              stroke={`url(#line-${p.id})`}
              strokeWidth="0.15"
              filter="url(#lineGlow)"
            />
          ))}
          {/* Pulsing dots at connection endpoints */}
          {positions.map((p) => (
            <circle key={`d-${p.id}`} cx={p.x} cy={p.y} r="0.4" fill={p.color} opacity="0.6">
              <animate attributeName="r" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        {/* Orbit ring visuals */}
        {ORBIT_LAYERS.map((config, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border"
            style={{
              inset: `${50 - config.radius}%`,
              borderColor: `hsl(var(--primary) / ${0.12 + i * 0.04})`,
              borderStyle: i === 1 ? "dashed" : "solid",
            }}
            animate={{ rotate: 360 * config.direction }}
            transition={{ duration: config.duration * 2, ease: "linear", repeat: Infinity }}
          />
        ))}

        {/* Dynamic lighting glow */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{ inset: "15%" }}
          animate={{
            background: [
              "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
              "radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 70%)",
              "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
            ],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Scanline */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{ maskImage: "radial-gradient(circle, black 55%, transparent 70%)" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Orbiting skill badges per layer */}
        {ORBIT_LAYERS.map((config, layerIdx) => {
          const layerSkills = layers.filter((l) => l.layer === layerIdx);
          return (
            <motion.div
              key={`orbit-${layerIdx}`}
              className="absolute inset-0"
              animate={hovered ? {} : { rotate: 360 * config.direction }}
              transition={hovered ? {} : { duration: config.duration, ease: "linear", repeat: Infinity }}
            >
              {layerSkills.map(({ skill }, i) => {
                const angle = (i / layerSkills.length) * Math.PI * 2;
                const r = config.radius;
                const x = 50 + r * Math.cos(angle);
                const y = 50 + r * Math.sin(angle);
                const Icon = (Icons as any)[skill.icon] ?? Icons.Sparkles;

                return (
                  <motion.div
                    key={skill.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    animate={hovered ? {} : { rotate: -360 * config.direction }}
                    transition={hovered ? {} : { duration: config.duration, ease: "linear", repeat: Infinity }}
                  >
                    <motion.div
                      className="group relative flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full backdrop-blur-xl border border-border/40 cursor-pointer"
                      style={{
                        background: `hsl(var(--card) / 0.6)`,
                        boxShadow: `0 0 16px ${skill.color}30, inset 0 1px 0 hsl(var(--foreground) / 0.05)`,
                      }}
                      whileHover={{
                        scale: 1.25,
                        boxShadow: `0 0 30px ${skill.color}60, 0 0 60px ${skill.color}20`,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon size={14} style={{ color: skill.color }} className="md:w-4 md:h-4" />
                      <span className="text-[10px] md:text-[11px] font-mono tracking-wider uppercase text-foreground whitespace-nowrap">
                        {skill.label}
                      </span>
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-mono bg-background/90 border border-border/60 text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                        {skill.label}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}

        {/* Data symbols ring */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ inset: "8%" }}
          animate={hovered ? {} : { rotate: -360 }}
          transition={hovered ? {} : { duration: 90, ease: "linear", repeat: Infinity }}
        >
          {["01", "Σ", "10", "π", "{ }", "∞", "λ", "Δ", "</>", "μ"].map((sym, i, arr) => {
            const angle = (i / arr.length) * Math.PI * 2;
            const r = 47;
            return (
              <motion.span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] md:text-[10px] tracking-widest"
                style={{
                  left: `${50 + r * Math.cos(angle)}%`,
                  top: `${50 + r * Math.sin(angle)}%`,
                  color: `hsl(var(--primary) / 0.5)`,
                  textShadow: "0 0 6px hsl(var(--primary) / 0.4)",
                }}
                animate={hovered ? {} : { rotate: 360, opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  rotate: hovered ? {} : { duration: 90, ease: "linear", repeat: Infinity },
                  opacity: { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                }}
              >
                {sym}
              </motion.span>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Profile image in center */}
      <div className="relative z-10">{children}</div>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-primary/80"
          style={{
            left: `${15 + (i * 7) % 70}%`,
            top: `${15 + (i * 11) % 70}%`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </motion.div>
  );
};
