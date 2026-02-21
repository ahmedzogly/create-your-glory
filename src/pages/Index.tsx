import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import projectDb from "@/assets/project-db.png";
import projectAnalysis from "@/assets/project-analysis.jpg";
import projectSeo from "@/assets/project-seo.png";
import projectHr1 from "@/assets/project-hr1.png";
import projectHr2 from "@/assets/project-hr2.png";
import projectPizza1 from "@/assets/project-pizza1.png";
import projectHr3 from "@/assets/project-hr3.png";
import projectPizza2 from "@/assets/project-pizza2.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const skills = [
  { category: "Data Analysis & BI", items: ["Microsoft Excel (Pivot Tables, VLOOKUP, Power Query)", "Power BI", "Tableau", "Google Sheets", "IBM SPSS Statistics"] },
  { category: "Programming & ML", items: ["Python", "pandas", "numpy", "matplotlib", "Machine Learning"] },
  { category: "Accounting & Finance", items: ["Financial Accounting", "Journal Entries", "Reconciliations", "Reporting"] },
  { category: "Soft Skills", items: ["Analytical Thinking", "Attention to Detail", "Problem-Solving", "Teamwork", "Time Management"] },
];

const projects = [
  { title: "Database Design — PageTurners Bookstore", description: "Designed a relational database with Sales, Customers, Books, and Sale_Details tables using SQL Server.", image: projectDb },
  { title: "HR Performance Analysis Dashboard", description: "Interactive Power BI dashboard analyzing 300 employees across departments, genders, and salary distributions.", image: projectHr2 },
  { title: "HR Analytics — Employee Money Transfer", description: "Detailed breakdown of employee money transfer methods with bar chart visualization.", image: projectHr1 },
  { title: "HR Analytics — Full Overview", description: "Comprehensive performance analysis with geographic mapping and hiring trends.", image: projectHr3 },
  { title: "Pizza Sales Dashboard — Excel", description: "Excel dashboard analyzing $817K+ in pizza sales across sizes, categories, and monthly trends.", image: projectPizza1 },
  { title: "Pizza Sales Dashboard — Power BI", description: "Power BI version with interactive slicers for pizza size, category, and quantity analysis.", image: projectPizza2 },
  { title: "Data Analytics Overview", description: "Traffic analysis dashboard with visitor insights, page views, and content performance metrics.", image: projectAnalysis },
  { title: "SEO Performance Dashboard", description: "SEO metrics tracking organic traffic growth, keyword rankings, backlinks, and domain authority.", image: projectSeo },
];

const HeroSection = () => (
  <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(174,72%,52%,0.08),transparent_50%)]" />
    <div className="container max-w-4xl text-center relative z-10 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-8 w-36 h-36 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/10"
      >
        <img src={profileImg} alt="Ahmed Shehta Zoghli" className="w-full h-full object-cover object-top" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-primary font-medium tracking-widest uppercase text-sm mb-6"
      >
        Data Analyst
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
      >
        Ahmed Shehta{" "}
        <span className="text-gradient">Zoghli</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
      >
        Transforming raw data into actionable insights. Skilled in Excel, Python, Power BI, Machine Learning, and Statistical Analysis.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground"
      >
        <a href="mailto:ahmedzogly26@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Mail size={16} /> ahmedzogly26@gmail.com
        </a>
        <span className="flex items-center gap-2">
          <Phone size={16} /> 01097401429
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={16} /> Cairo, Egypt
        </span>
        <a href="https://www.linkedin.com/in/ahmed-shehta-zoghli" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Linkedin size={16} /> LinkedIn
        </a>
      </motion.div>
    </div>
  </section>
);

const SummarySection = () => (
  <section className="py-24 px-6">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-6">Summary</h2>
      </motion.div>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="text-muted-foreground leading-relaxed text-lg">
        Data Analyst with 2 years of self-learning experience, currently a Trainee in the Digilians initiative, implemented by the Ministry of Communications and Information Technology (MCIT) in collaboration with the Egyptian Military Academy. Selected for this national program focused on Data Analysis and Artificial Intelligence. Skilled in Microsoft Excel, Statistical Data Analysis, Database Design, Python, Power BI, Machine Learning, Tableau, Google Sheets, and IBM SPSS Statistics, with a strong focus on transforming data into actionable insights.
      </motion.p>
    </div>
  </section>
);

const ExperienceSection = () => (
  <section className="py-24 px-6 bg-card/50">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Work Experience</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">Graduate Accountant</h3>
            <p className="text-primary text-sm font-medium">Trainee — Digilians</p>
          </div>
          <span className="text-muted-foreground text-sm mt-1 md:mt-0 shrink-0">Dec 2025 — Sep 2026</span>
        </div>
        <ul className="space-y-3 text-muted-foreground">
          {[
            "Developing practical skills in Data Analysis, Statistical Analysis, Database Design, Python, Power BI, Machine Learning.",
            "Hands-on experience in transforming raw data into interactive dashboards and reports.",
            "Learning to apply AI and data-driven solutions to real-world business problems.",
            "Analyze financial data using Microsoft Excel to identify trends and variances in revenues and expenses.",
            "Prepare simplified financial reports and dashboards illustrating financial performance.",
            "Assist in reconciling accounts, focusing on variance analysis.",
            "Use analytical thinking to support financial and managerial decisions.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

const EducationSection = () => (
  <section className="py-24 px-6">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Education</h2>
      </motion.div>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h3 className="text-xl font-semibold">Bachelor of Commerce in Accounting</h3>
            <p className="text-primary text-sm font-medium">Mansoura University</p>
          </div>
          <span className="text-muted-foreground text-sm mt-1 md:mt-0 shrink-0">Sep 2019 — Oct 2023</span>
        </div>
        <p className="text-muted-foreground mt-3">Financial Accounting, Management Accounting, Business Statistics</p>
      </motion.div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section className="py-24 px-6">
    <div className="container max-w-5xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Projects</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i + 1}
            className="group rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SkillsSection = () => (
  <section className="py-24 px-6 bg-card/50">
    <div className="container max-w-3xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
        <div className="section-divider mb-6" />
        <h2 className="text-3xl font-bold mb-10">Skills</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8">
        {skills.map((group, i) => (
          <motion.div key={group.category} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
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
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SummarySection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2026 Ahmed Shehta Zoghli Osman. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
