import { useEffect, useState, useCallback } from "react";

export type PaletteId = "violet" | "emerald" | "sunset" | "cyan" | "rose" | "gold";

export interface Palette {
  id: PaletteId;
  name: string;
  primary: string;       // "H S% L%"
  primaryGlow: string;
  accent: string;
  accentGlow: string;
}

export const PALETTES: Palette[] = [
  { id: "violet",  name: "Neon Violet",  primary: "268 92% 65%", primaryGlow: "268 100% 75%", accent: "220 100% 62%", accentGlow: "200 100% 70%" },
  { id: "emerald", name: "Emerald Plex", primary: "160 84% 55%", primaryGlow: "160 90% 65%",  accent: "180 90% 55%",  accentGlow: "190 95% 65%"  },
  { id: "sunset",  name: "Sunset",       primary: "20 95% 60%",  primaryGlow: "30 100% 70%",  accent: "340 90% 60%",  accentGlow: "350 100% 72%" },
  { id: "cyan",    name: "Cyber Cyan",   primary: "190 95% 55%", primaryGlow: "190 100% 70%", accent: "260 90% 65%",  accentGlow: "270 100% 75%" },
  { id: "rose",    name: "Rose Gold",    primary: "330 85% 62%", primaryGlow: "330 95% 72%",  accent: "40 95% 60%",   accentGlow: "45 100% 70%"  },
  { id: "gold",    name: "Royal Gold",   primary: "43 96% 56%",  primaryGlow: "48 100% 65%",  accent: "28 90% 52%",   accentGlow: "35 95% 62%"   },
];

const STORAGE_KEY = "portfolio-palette";

const apply = (p: Palette) => {
  const r = document.documentElement;
  r.style.setProperty("--primary", p.primary);
  r.style.setProperty("--primary-glow", p.primaryGlow);
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--accent-glow", p.accentGlow);
  r.style.setProperty("--ring", p.primary);
  r.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${p.primary}), hsl(${p.accent}))`
  );
  r.setAttribute("data-palette", p.id);
};

const getInitial = (): PaletteId => {
  if (typeof window === "undefined") return "violet";
  return (localStorage.getItem(STORAGE_KEY) as PaletteId) || "violet";
};

export const usePalette = () => {
  const [paletteId, setPaletteId] = useState<PaletteId>(getInitial);

  useEffect(() => {
    const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];
    apply(p);
    localStorage.setItem(STORAGE_KEY, p.id);
  }, [paletteId]);

  const cycle = useCallback(() => {
    setPaletteId((cur) => {
      const i = PALETTES.findIndex((x) => x.id === cur);
      return PALETTES[(i + 1) % PALETTES.length].id;
    });
  }, []);

  return { paletteId, setPaletteId, cycle, palettes: PALETTES };
};
