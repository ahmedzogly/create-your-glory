import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "en" | "ar";

const LANG_KEY = "portfolio_site_lang";

const translations = {
  en: {
    // Navbar
    about: "About",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    portfolio: "Portfolio",
    admin: "Admin",
    // Hero
    scrollDown: "Scroll down",
    // Summary
    aboutMe: "About",
    aboutMeHighlight: "Me",
    // Stats
    workExperiences: "Work Experiences",
    projectsDelivered: "Projects Delivered",
    qualifications: "Qualifications",
    commitment: "Commitment",
    // Experience
    workExperience: "Work",
    workExperienceHighlight: "Experience",
    // Education
    educationTitle: "Education",
    // Projects
    projectsTitle: "Projects",
    projectsSubtitle: "Hand-picked work across analytics, dashboards and ML.",
    all: "All",
    viewProject: "View Project",
    close: "Close",
    // Skills
    skillsTitle: "Skills",
    skillsSuffix: "& Stack",
    // Contact
    getInTouch: "Get in Touch",
    getInTouchHighlight: "Touch",
    contactSubtitle: "I'd love to hear from you or discuss opportunities",
    email: "Email",
    phone: "Phone",
    location: "Location",
    follow: "Follow",
    name: "Name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Write your message here...",
    sendMessage: "Send Message",
    // Promo
    certifications: "Certifications",
    // Footer
    footerText: "Crafted with precision.",
  },
  ar: {
    about: "نبذة",
    experience: "الخبرات",
    education: "التعليم",
    projects: "المشاريع",
    skills: "المهارات",
    portfolio: "البورتفوليو",
    admin: "لوحة التحكم",
    scrollDown: "اسحب لأسفل",
    aboutMe: "نبذة",
    aboutMeHighlight: "عني",
    workExperiences: "خبرات عمل",
    projectsDelivered: "مشاريع منجزة",
    qualifications: "مؤهلات",
    commitment: "التزام",
    workExperience: "الخبرات",
    workExperienceHighlight: "المهنية",
    educationTitle: "التعليم",
    projectsTitle: "المشاريع",
    projectsSubtitle: "أعمال مختارة في التحليلات ولوحات البيانات وتعلم الآلة.",
    all: "الكل",
    viewProject: "عرض المشروع",
    close: "إغلاق",
    skillsTitle: "المهارات",
    skillsSuffix: "والأدوات",
    getInTouch: "تواصل",
    getInTouchHighlight: "معي",
    contactSubtitle: "يسعدني سماع رأيك أو مناقشة الفرص",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    location: "الموقع",
    follow: "تابعني",
    name: "الاسم",
    namePlaceholder: "اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "بريدك@مثال.com",
    messageLabel: "الرسالة",
    messagePlaceholder: "اكتب رسالتك هنا...",
    sendMessage: "إرسال الرسالة",
    certifications: "الشهادات",
    footerText: "صُنع بإتقان.",
  },
} as const;

type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem(LANG_KEY) as Lang) || "en");

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "ar" : "en";
      localStorage.setItem(LANG_KEY, next);
      return next;
    });
  }, []);

  const t = translations[lang];
  const isRtl = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
