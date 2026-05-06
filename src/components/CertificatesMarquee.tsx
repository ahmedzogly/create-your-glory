import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCertificates, type Certificate } from "@/hooks/use-site-data";
import { useLanguage } from "@/hooks/use-language";

const ar = (isAr: boolean, arVal: string | undefined | null, enVal: string) =>
  isAr && arVal ? arVal : enVal;
import certFoundations from "@/assets/certificates/cert-foundations.webp";
import certAskQuestions from "@/assets/certificates/cert-ask-questions.webp";
import certPrepareData from "@/assets/certificates/cert-prepare-data.webp";
import certProcessData from "@/assets/certificates/cert-process-data.webp";
import certAnalyzeData from "@/assets/certificates/cert-analyze-data.webp";
import certShareData from "@/assets/certificates/cert-share-data.webp";
import certPython from "@/assets/certificates/cert-python.webp";
import certCapstone from "@/assets/certificates/cert-capstone.webp";
import certJobSearch from "@/assets/certificates/cert-job-search.webp";
import certProfessional from "@/assets/certificates/cert-professional.webp";

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
  const { isRtl } = useLanguage();
  const [selected, setSelected] = useState<Certificate | null>(null);
  if (items.length === 0) return null;

  const looped = [...items, ...items];

  return (
    <>
      <div className="relative w-full overflow-hidden py-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: items.length * 5, ease: "linear", repeat: Infinity }}
        >
          {looped.map((cert, i) => (
            <button
              key={`${cert.id}-${i}`}
              type="button"
              onClick={() => setSelected(cert)}
              className="shrink-0 text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
            >
              <div className="w-[300px] md:w-[360px] shrink-0 rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all hover:scale-[1.02] group cursor-zoom-in">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={resolveImage(cert.image_url)}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width={360}
                    height={270}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{ar(isRtl, cert.title_ar, cert.title)}</h3>
                    {cert.link && <ExternalLink size={14} className="text-primary shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-muted-foreground text-xs mb-1">{ar(isRtl, cert.issuer_ar, cert.issuer)}</p>
                  {(cert.description || cert.description_ar) && (
                    <p className="text-muted-foreground/80 text-xs line-clamp-2">{ar(isRtl, cert.description_ar, cert.description ?? "")}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-card border-primary/30">
          {selected && (
            <div className="flex flex-col">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-20 rounded-full bg-background/80 backdrop-blur p-2 hover:bg-background transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="bg-muted overflow-auto max-h-[75vh]">
                <img
                  src={resolveImage(selected.image_url)}
                  alt={selected.title}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="p-5 border-t border-border">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-lg font-bold">{ar(isRtl, selected.title_ar, selected.title)}</h3>
                  {selected.link && (
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
                    >
                      Verify <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{ar(isRtl, selected.issuer_ar, selected.issuer)}</p>
                {(selected.description || selected.description_ar) && (
                  <p className="text-sm text-muted-foreground/90">{ar(isRtl, selected.description_ar, selected.description ?? "")}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
