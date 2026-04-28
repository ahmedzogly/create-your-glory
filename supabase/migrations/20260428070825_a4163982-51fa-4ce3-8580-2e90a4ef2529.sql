-- Certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  description text,
  image_url text NOT NULL,
  link text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins manage certificates" ON public.certificates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orbit skills (labels around profile photo)
CREATE TABLE public.orbit_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Sparkles',
  color text NOT NULL DEFAULT 'hsl(180 85% 55%)',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orbit_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read orbit_skills" ON public.orbit_skills FOR SELECT USING (true);
CREATE POLICY "Admins manage orbit_skills" ON public.orbit_skills FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_orbit_skills_updated_at BEFORE UPDATE ON public.orbit_skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed orbit skills
INSERT INTO public.orbit_skills (label, icon, color, display_order) VALUES
  ('Power BI', 'BarChart3', 'hsl(45 100% 60%)', 1),
  ('SQL', 'Database', 'hsl(200 90% 60%)', 2),
  ('Python', 'Code2', 'hsl(140 70% 55%)', 3),
  ('Tableau', 'PieChart', 'hsl(25 95% 60%)', 4),
  ('ML', 'Brain', 'hsl(280 80% 65%)', 5),
  ('Analytics', 'TrendingUp', 'hsl(180 85% 55%)', 6),
  ('Excel', 'Table2', 'hsl(150 70% 50%)', 7),
  ('Data', 'FileSpreadsheet', 'hsl(320 75% 65%)', 8);

-- Seed certificates (using existing asset filenames; admin can replace with uploaded URLs)
INSERT INTO public.certificates (title, issuer, description, image_url, link, display_order) VALUES
  ('Google Data Analytics', 'Professional Certificate', 'Complete 9-course program covering SQL, Python, Tableau, R, and data visualization.', '/cert/cert-professional.jpg', NULL, 1),
  ('Foundations: Data, Data, Everywhere', 'Google / Coursera', 'Introduction to data analytics and the role of the data analyst.', '/cert/cert-foundations.jpg', NULL, 2),
  ('Ask Questions to Make Data-Driven Decisions', 'Google / Coursera', 'Framing problems and asking effective analytical questions.', '/cert/cert-ask-questions.jpg', NULL, 3),
  ('Prepare Data for Exploration', 'Google / Coursera', 'Data collection, bias, and preparing data for analysis.', '/cert/cert-prepare-data.jpg', NULL, 4),
  ('Process Data from Dirty to Clean', 'Google / Coursera', 'Data cleaning with spreadsheets and SQL.', '/cert/cert-process-data.jpg', NULL, 5),
  ('Analyze Data to Answer Questions', 'Google / Coursera', 'Organizing and formatting data, performing calculations.', '/cert/cert-analyze-data.jpg', NULL, 6),
  ('Share Data Through Visualization', 'Google / Coursera', 'Tableau dashboards, data storytelling, and presentations.', '/cert/cert-share-data.jpg', NULL, 7),
  ('Introduction to Data Analysis Using Python', 'Google / Coursera', 'Python fundamentals for data analysis using pandas and NumPy.', '/cert/cert-python.jpg', NULL, 8),
  ('Data Analytics Capstone: Case Study', 'Google / Coursera', 'End-to-end capstone case study applying the data analysis process.', '/cert/cert-capstone.jpg', NULL, 9),
  ('Accelerate Your Job Search with AI', 'Google / Coursera', 'Using AI tools to strengthen resume and job search.', '/cert/cert-job-search.jpg', NULL, 10);