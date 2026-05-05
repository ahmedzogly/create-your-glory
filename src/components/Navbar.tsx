import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { Moon, Sun, Menu, X, LogIn, LayoutDashboard, LogOut, Github, Languages } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
import { cn } from "@/lib/utils";

export const Navbar = ({ name }: { name: string }) => {
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const { t, lang, toggleLang, isRtl } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const NAV_LINKS = [
    { id: "summary", label: t.about },
    { id: "experience", label: t.experience },
    { id: "education", label: t.education },
    { id: "projects", label: t.projects },
    { id: "skills", label: t.skills },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("");

  const handleNav = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-strong shadow-[0_8px_32px_-12px_hsl(var(--primary)/0.25)]"
            : "bg-transparent"
        )}
      >
        <div className="container max-w-6xl flex items-center justify-between h-16 px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 font-display font-bold text-lg group"
          >
            <span className="relative w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm shadow-glow-sm group-hover:shadow-glow transition-shadow">
              {initials || "P"}
            </span>
            <span className="hidden sm:inline text-foreground tracking-tight">Portfolio</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/60 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/ahmedzogly"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground hover:text-primary transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="https://wa.me/2001097401429"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-green-500 hover:text-green-400 transition-colors"
            >
              <SiWhatsapp size={18} />
            </a>
            <PaletteSwitcher />
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground transition-colors text-xs font-bold"
            >
              {lang === "en" ? "عر" : "EN"}
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium bg-gradient-primary text-primary-foreground shadow-glow-sm hover:shadow-glow transition-shadow"
                  >
                    <LayoutDashboard size={15} />
                    Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  aria-label="Sign out"
                  className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium border border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/60 transition-colors"
              >
                <LogIn size={15} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-secondary/60 text-foreground"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container max-w-6xl px-6 py-3 flex flex-col">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className="text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </motion.header>

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-primary origin-left z-[60] shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
      />
    </>
  );
};
