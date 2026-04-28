import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export const ContactSection = ({ email, phone, location, linkedin, github }: Props) => {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email: fromEmail, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const subject = encodeURIComponent(`Portfolio contact from ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.message}\n\nFrom: ${parsed.data.name} <${parsed.data.email}>`);
    window.location.href = `mailto:${email ?? ""}?subject=${subject}&body=${body}`;
  };

  const infoRows = [
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    phone && { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    location && { icon: MapPin, label: "Location", value: location },
  ].filter(Boolean) as { icon: any; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="relative py-24 px-6 scroll-mt-20 overflow-hidden">
      {/* Plexus network background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_60%)]" />
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="plexus" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="20" r="1.5" fill="hsl(var(--primary))" />
            <circle cx="90" cy="60" r="1" fill="hsl(var(--primary))" />
            <circle cx="150" cy="30" r="1.5" fill="hsl(var(--primary))" />
            <circle cx="60" cy="140" r="1" fill="hsl(var(--primary))" />
            <circle cx="130" cy="160" r="1.5" fill="hsl(var(--primary))" />
            <line x1="10" y1="20" x2="90" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.3" />
            <line x1="90" y1="60" x2="150" y2="30" stroke="hsl(var(--primary))" strokeWidth="0.3" />
            <line x1="90" y1="60" x2="60" y2="140" stroke="hsl(var(--primary))" strokeWidth="0.3" />
            <line x1="60" y1="140" x2="130" y2="160" stroke="hsl(var(--primary))" strokeWidth="0.3" />
            <line x1="130" y1="160" x2="150" y2="30" stroke="hsl(var(--primary))" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#plexus)" />
      </svg>

      <div className="container max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono tracking-widest uppercase mb-5">
            <MessageSquare size={12} className="text-primary" /> Get in Touch
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-[1.05]">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            I'd love to hear from you or discuss opportunities
          </p>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl glass p-8 mb-8"
        >
          <div className="space-y-5">
            {infoRows.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-foreground hover:text-primary transition-colors break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-foreground">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(linkedin || github) && (
            <>
              <div className="h-px bg-border/60 my-6" />
              <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">Follow</p>
              <div className="flex gap-3">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                     className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:text-primary hover:border-primary/40 transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"
                     className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:text-primary hover:border-primary/40 transition-colors">
                    <Github size={16} />
                  </a>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Form card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl glass p-8 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" placeholder="your@email.com" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} maxLength={255} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-msg">Message</Label>
            <Textarea id="c-msg" rows={6} placeholder="Write your message here..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-95">
            <Send size={16} className="mr-2" /> Send Message
          </Button>
        </motion.form>
      </div>
    </section>
  );
};
