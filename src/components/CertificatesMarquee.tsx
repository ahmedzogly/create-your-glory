import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useCertificates } from "@/hooks/use-site-data";
import certFoundations from "@/assets/certificates/cert-foundations.jpg";
import certAskQuestions from "@/assets/certificates/cert-ask-questions.jpg";
import certPrepareData from "@/assets/certificates/cert-prepare-data.jpg";
import certProcessData from "@/assets/certificates/cert-process-data.jpg";
import certAnalyzeData from "@/assets/certificates/cert-analyze-data.jpg";
import certShareData from "@/assets/certificates/cert-share-data.jpg";
import certPython from "@/assets/certificates/cert-python.jpg";
import certCapstone from "@/assets/certificates/cert-capstone.jpg";
import certJobSearch from "@/assets/certificates/cert-job-search.jpg";
import certProfessional from "@/assets/certificates/cert-professional.jpg";

// Map seeded placeholder paths to bundled assets so the gallery renders out of the box.
const seedMap: Record<string, string> = {
  "/cert/cert-professional.jpg": certProfessional,
  "/cert/cert-foundations.jpg": certFoundations,
  "/cert/cert-ask-questions.jpg": certAskQuestions,
  "/cert/cert-prepare-data.jpg": certPrepareData,
  "/cert/cert-process-data.jpg": certProcessData,
  "/cert/cert-analyze-data.jpg": certAnalyzeData,
  "/cert/cert-share-data.jpg": certShareData,
  "/cert/cert-python.jpg": certPython,
  "/cert/cert-capstone.jpg": certCapstone,
  "/cert/cert-job-search.jpg": certJobSearch,
};

const resolveImage = (url: string) => seedMap[url] ?? url;

export const CertificatesMarquee = () => {
  const { items } = useCertificates();
  if (items.length === 0) return null;

  const looped = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: items.length * 5, ease: "linear", repeat: Infinity }}
      >
        {looped.map((cert, i) => {
          const card = (
            <div className="w-[300px] md:w-[360px] shrink-0 rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors group">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={resolveImage(cert.image_url)} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm line-clamp-1">{cert.title}</h3>
                  {cert.link && <ExternalLink size={14} className="text-primary shrink-0 mt-0.5" />}
                </div>
                <p className="text-muted-foreground text-xs mb-1">{cert.issuer}</p>
                {cert.description && (
                  <p className="text-muted-foreground/80 text-xs line-clamp-2">{cert.description}</p>
                )}
              </div>
            </div>
          );
          return (
            <div key={`${cert.id}-${i}`} className="shrink-0">
              {cert.link ? (
                <a href={cert.link} target="_blank" rel="noreferrer" className="block">{card}</a>
              ) : (
                card
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
