import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Camera, Loader2, ArrowDown } from "lucide-react";
import { useProfileImage } from "@/hooks/use-profile-image";
import { ImageCropper } from "@/components/ImageCropper";
import { PromoSection } from "@/components/PromoSection";
import { Navbar } from "@/components/Navbar";
import { TypingText } from "@/components/TypingText";
import { StatsSection } from "@/components/StatsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import {
  useSiteContent,
  useExperiences,
  useEducation,
  useProjects,
  useSkills,
} from "@/hooks/use-site-data";
import profileImg from "@/assets/profile.jpg";

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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(190,80%,65%,0.08),transparent_50%)]" />

      <div className="container max-w-4xl text-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 w-36 h-36 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/10 relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={imageUrl} alt={fullName} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white" />}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </motion.div>
        <ImageCropper open={cropperOpen} onClose={() => setCropperOpen(false)} imageSrc={rawImage} onCrop={handleCrop} />

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="mb-6 min-h-[28px]"
        >
          {typingWords.length > 0 ? (
            <TypingText
              words={typingWords}
              className="text-primary font-medium tracking-widest uppercase text-sm"
            />
          ) : (
            <span className="text-primary font-medium tracking-widest uppercase text-sm">{role}</span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          {firstName} <span className="text-gradient">{lastName}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          {content.hero_tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground"
        >
          {content.contact_email && (
            <a href={`mailto:${content.contact_email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={16} /> {content.contact_email}
            </a>
          )}
          {content.contact_phone && <span className="flex items-center gap-2"><Phone size={16} /> {content.contact_phone}</span>}
          {content.contact_location && <span className="flex items-center gap-2"><MapPin size={16} /> {content.contact_location}</span>}
          {content.contact_linkedin && (
            <a href={content.contact_linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Linkedin size={16} /> LinkedIn
            </a>
          )}
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={22} />
      </motion.button>
    </section>
  );
};

const SummarySection = ({ summary }: { summary: string }) => (
  <section id="summary" className="py-24 px-6 scroll-mt-20">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-6">Summary</h2>
      </motion.div>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="text-muted-foreground leading-relaxed text-lg">
        {summary}
      </motion.p>
    </div>
  </section>
);

const ExperienceSection = ({ items }: { items: any[] }) => (
  <section id="experience" className="py-24 px-6 bg-card/50 scroll-mt-20">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Work Experience</h2>
      </motion.div>
      <div className="space-y-12">
        {items.map((exp, idx) => (
          <motion.div key={exp.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx + 1}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <p className="text-primary text-sm font-medium">{exp.company}</p>
              </div>
              <span className="text-muted-foreground text-sm mt-1 md:mt-0 shrink-0">{exp.period}</span>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              {exp.bullets.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
        <h2 className="text-3xl font-bold mb-10">Education</h2>
      </motion.div>
      <div className="space-y-8">
        {items.map((edu, idx) => (
          <motion.div key={edu.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx + 1}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                <p className="text-primary text-sm font-medium">{edu.school}</p>
              </div>
              <span className="text-muted-foreground text-sm mt-1 md:mt-0 shrink-0">{edu.period}</span>
            </div>
            {edu.description && <p className="text-muted-foreground mt-3">{edu.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SkillsSection = ({ items }: { items: any[] }) => (
  <section id="skills" className="py-24 px-6 bg-card/50 scroll-mt-20">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Skills</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((group, i) => (
          <motion.div key={group.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill: string) => (
                <span key={skill} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-md">
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
    <div className="min-h-screen bg-background">
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
      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2026 {content.hero_title ?? ""}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
