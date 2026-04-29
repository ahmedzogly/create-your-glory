import { useEffect, useRef } from "react";

/**
 * PlexusBackground — animated network of points connected by lines.
 * Lightweight Canvas 2D implementation with IntersectionObserver pause and
 * device-pixel-ratio awareness. Uses theme color via CSS variable --primary.
 */
export const PlexusBackground = ({
  className = "",
  density = 0.00009,
  maxDistance = 140,
  speed = 0.25,
  opacity = 0.55,
}: {
  className?: string;
  density?: number;
  maxDistance?: number;
  speed?: number;
  opacity?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let points: { x: number; y: number; vx: number; vy: number }[] = [];

    const readColor = () => {
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue("--primary").trim() || "268 92% 65%";
      const accent = styles.getPropertyValue("--accent").trim() || "220 100% 62%";
      return { primary, accent };
    };
    let colors = readColor();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(28, Math.min(120, Math.floor(width * height * density)));
      points = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }));
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    // Refresh colors when theme changes (class on <html>)
    const mo = new MutationObserver(() => {
      colors = readColor();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-palette"] });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      ctx.clearRect(0, 0, width, height);

      // update
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // lines
      const max2 = maxDistance * maxDistance;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < max2) {
            const t = 1 - d2 / max2;
            const alpha = t * 0.55 * opacity;
            ctx.strokeStyle = `hsla(${colors.primary} / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // points
      for (const p of points) {
        ctx.fillStyle = `hsla(${colors.accent} / ${0.85 * opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [density, maxDistance, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
