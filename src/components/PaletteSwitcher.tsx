import { useState, useRef, useEffect } from "react";
import { Palette as PaletteIcon, Check } from "lucide-react";
import { usePalette } from "@/hooks/use-palette";

export const PaletteSwitcher = () => {
  const { paletteId, setPaletteId, palettes } = usePalette();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change color palette"
        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground transition-colors"
      >
        <PaletteIcon size={18} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl glass-strong p-2 z-50 shadow-glow-sm animate-fade-in">
          <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Color Palette
          </div>
          {palettes.map((p) => {
            const active = p.id === paletteId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPaletteId(p.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/60 transition-colors text-left"
              >
                <span
                  className="w-6 h-6 rounded-full border border-border/60 shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${p.primary}), hsl(${p.accent}))`,
                    boxShadow: `0 0 12px hsl(${p.primary} / 0.5)`,
                  }}
                />
                <span className="flex-1 text-sm text-foreground">{p.name}</span>
                {active && <Check size={14} className="text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
