import { motion } from "framer-motion";
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

const certificates = [
  { img: certProfessional, title: "Google Data Analytics", issuer: "Professional Certificate" },
  { img: certFoundations, title: "Foundations: Data, Data, Everywhere", issuer: "Google / Coursera" },
  { img: certAskQuestions, title: "Ask Questions to Make Data-Driven Decisions", issuer: "Google / Coursera" },
  { img: certPrepareData, title: "Prepare Data for Exploration", issuer: "Google / Coursera" },
  { img: certProcessData, title: "Process Data from Dirty to Clean", issuer: "Google / Coursera" },
  { img: certAnalyzeData, title: "Analyze Data to Answer Questions", issuer: "Google / Coursera" },
  { img: certShareData, title: "Share Data Through Visualization", issuer: "Google / Coursera" },
  { img: certPython, title: "Introduction to Data Analysis Using Python", issuer: "Google / Coursera" },
  { img: certCapstone, title: "Data Analytics Capstone: Case Study", issuer: "Google / Coursera" },
  { img: certJobSearch, title: "Accelerate Your Job Search with AI", issuer: "Google / Coursera" },
];

export const CertificatesMarquee = () => {
  const looped = [...certificates, ...certificates];
  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: certificates.length * 5, ease: "linear", repeat: Infinity }}
      >
        {looped.map((cert, i) => (
          <div
            key={`${cert.title}-${i}`}
            className="w-[300px] md:w-[360px] shrink-0 rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={cert.img} alt={cert.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{cert.title}</h3>
              <p className="text-muted-foreground text-xs">{cert.issuer}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
