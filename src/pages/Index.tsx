import { useState, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Camera, Loader2, ArrowDown } from "lucide-react";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useAuth } from "@/hooks/use-auth";
import { ImageCropper } from "@/components/ImageCropper";
import { Navbar } from "@/components/Navbar";
import { TypingText } from "@/components/TypingText";
import { Chatbot } from "@/components/Chatbot";
import {
  useSiteContent,
  useExperiences,
  useEducation,
  useProjects,
  useSkills,
} from "@/hooks/use-site-data";
import profileImg from "@/assets/profile.jpg";

// Lazy-load heavy / below-fold components
const WebGLBackground = lazy(() => import("@/components/WebGLBackground").then(m => ({ default: m.WebGLBackground })));
const PlexusBackground = lazy(() => import("@/components/PlexusBackground").then(m => ({ default: m.PlexusBackground })));
const SkillsOrbit = lazy(() => import("@/components/SkillsOrbit").then(m => ({ default: m.SkillsOrbit })));
const StatsSection = lazy(() => import("@/components/StatsSection").then(m => ({ default: m.StatsSection })));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection").then(m => ({ default: m.ProjectsSection })));
const PromoSection = lazy(() => import("@/components/PromoSection").then(m => ({ default: m.PromoSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(m => ({ default: m.ContactSection })));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const HeroSection = ({ content }: { content: Record<string, string> }) => {
  const { imageUrl, uploading, upload } = useProfileImage(profileImg);
  const { isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (blob: Blob) => {
    setCropperOpen(false);
    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    upload(file);
  };

  const fullName = content.hero_title ?? "";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ");

  const role = content.hero_role ?? "";
  const typingWords = role
    .split(/[|•/,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 noise">
      {/* Layered atmospheric backgrounds */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <PlexusBackground className="absolute inset-0 w-full h-full opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.14),transparent_55%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/15 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="container max-w-4xl text-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <SkillsOrbit>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className={`w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden relative group animate-pulse-glow ${isAdmin ? "cursor-pointer" : ""}`}
              onClick={isAdmin ? () => fileInputRef.current?.click() : undefined}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-primary p-[3px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-background">
                  <img src={imageUrl} alt={fullName} className="w-full h-full object-cover object-top" />
                </div>
              </div>
              {isAdmin && (
                <>
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? <Loader2 size={28} className="text-white animate-spin" /> : <Camera size={28} className="text-white" />}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </>
              )}
            </motion.div>
          </SkillsOrbit>
        </motion.div>
        <ImageCropper open={cropperOpen} onClose={() => setCropperOpen(false)} imageSrc={rawImage} onCrop={handleCrop} />

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-6 min-h-[28px] inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono tracking-widest uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse" />
          {typingWords.length > 0 ? (
            <TypingText words={typingWords} className="text-foreground" />
          ) : (
            <span className="text-foreground">{role}</span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
        >
          {firstName} <span className="text-gradient-glow animate-gradient bg-gradient-primary">{lastName}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          {content.hero_tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10 text-sm"
        >
          {content.contact_email && (
            <a href={`mailto:${content.contact_email}`} className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:text-primary transition-colors">
              <Mail size={14} /> {content.contact_email}
            </a>
          )}
          {content.contact_phone && <span className="flex items-center gap-2 px-4 py-2 rounded-full glass text-muted-foreground"><Phone size={14} /> {content.contact_phone}</span>}
          {content.contact_location && <span className="flex items-center gap-2 px-4 py-2 rounded-full glass text-muted-foreground"><MapPin size={14} /> {content.contact_location}</span>}
          {content.contact_linkedin && (
            <a href={content.contact_linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:text-primary transition-colors">
              <Linkedin size={14} /> LinkedIn
            </a>
          )}
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={18} />
      </motion.button>
    </section>
  );
};

const SummarySection = ({ summary }: { summary: string }) => (
  <section id="summary" className="py-24 px-6 scroll-mt-20 relative">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-gradient">Me</span></h2>
      </motion.div>
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        className="relative p-8 md:p-10 rounded-2xl glass"
      >
        <p className="text-muted-foreground leading-relaxed text-lg">{summary}</p>
      </motion.div>
    </div>
  </section>
);

const ExperienceSection = ({ items }: { items: any[] }) => (
  <section id="experience" className="py-24 px-6 scroll-mt-20 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,hsl(var(--primary)/0.06),transparent_60%)]" />
    <div className="container max-w-3xl relative">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Work <span className="text-gradient">Experience</span></h2>
      </motion.div>
      <div className="relative space-y-6 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary/60 before:via-accent/40 before:to-transparent">
        {items.map((exp, idx) => (
          <motion.div
            key={exp.id}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx + 1}
            className="relative pl-10 md:pl-14"
          >
            <span className="absolute left-0 md:left-1 top-6 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-primary shadow-glow-sm flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-background" />
            </span>
            <div className="rounded-2xl glass p-6 hover:-translate-y-0.5 transition-transform">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-3">
                <div className="flex items-center gap-3">
                  {exp.image_url && (
                    <img src={exp.image_url} alt={exp.company} className="w-12 h-12 rounded-lg object-cover border border-border/50 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-gradient text-sm font-medium">{exp.company}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs font-mono px-3 py-1 rounded-full glass shrink-0 self-start">{exp.period}</span>
              </div>
              <ul className="space-y-2 text-muted-foreground text-sm">
                {exp.bullets.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_6px_hsl(var(--primary))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const EducationSection = ({ items }: { items: any[] }) => (
  <section id="education" className="py-24 px-6 scroll-mt-20">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-10"><span className="text-gradient">Education</span></h2>
      </motion.div>
      <div className="grid gap-5">
        {items.map((edu, idx) => (
          <motion.div
            key={edu.id}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx + 1}
            className="rounded-2xl glass glow-border p-6 hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
              <div className="flex items-center gap-3">
                {edu.image_url && (
                  <img src={edu.image_url} alt={edu.school} className="w-12 h-12 rounded-lg object-cover border border-border/50 shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-gradient text-sm font-medium">{edu.school}</p>
                </div>
              </div>
              <span className="text-muted-foreground text-xs font-mono px-3 py-1 rounded-full glass shrink-0 self-start">{edu.period}</span>
            </div>
            {edu.description && <p className="text-muted-foreground mt-3 text-sm">{edu.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SkillsSection = ({ items }: { items: any[] }) => (
  <section id="skills" className="py-24 px-6 scroll-mt-20 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,hsl(var(--accent)/0.06),transparent_60%)]" />
    <div className="container max-w-3xl relative">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-10"><span className="text-gradient">Skills</span> & Stack</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((group, i) => (
          <motion.div
            key={group.id}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
            className="rounded-2xl glass p-6"
          >
            <h3 className="text-xs font-mono text-gradient uppercase tracking-widest mb-4">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill: string) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg glass-strong text-foreground text-sm hover:text-gradient transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  const { content, loading } = useSiteContent();
  const { items: experiences } = useExperiences();
  const { items: education } = useEducation();
  const { items: projects } = useProjects();
  const { items: skills } = useSkills();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen relative">
      <WebGLBackground />
      <div className="relative z-10">
      <Navbar name={content.hero_title ?? ""} />
      <HeroSection content={content} />
      <SummarySection summary={content.summary ?? ""} />
      <StatsSection
        experienceCount={experiences.length}
        projectsCount={projects.length}
        educationCount={education.length}
      />
      <ExperienceSection items={experiences} />
      <EducationSection items={education} />
      <ProjectsSection items={projects} />
      <PromoSection
        title={content.promo_title ?? "Want a Portfolio Like This?"}
        subtitle={content.promo_subtitle ?? "I build modern animated portfolios. Get yours today."}
        ctaText={content.promo_cta_text ?? "Contact Me"}
        ctaLink={content.promo_cta_link ?? `mailto:${content.contact_email ?? ""}`}
        projects={projects}
      />
      <SkillsSection items={skills} />
      <ContactSection
        email={content.contact_email}
        phone={content.contact_phone}
        location={content.contact_location}
        linkedin={content.contact_linkedin}
        github={content.contact_github}
      />
      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border/50">
        <p className="font-mono text-xs tracking-wider">© 2026 {content.hero_title ?? ""} — Crafted with precision.</p>
      </footer>
      </div>
      <Chatbot />
    </div>
  );
};

export default Index;
