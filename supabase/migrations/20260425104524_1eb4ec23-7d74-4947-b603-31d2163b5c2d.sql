
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Site content key-value table
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 6. Experiences
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  bullets TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 7. Education
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- 8. Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 9. Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- 10. Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_experiences_updated BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_education_updated BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_skills_updated BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. RLS Policies — Public read on portfolio content
CREATE POLICY "Public can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can read profiles" ON public.profiles FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admins manage site_content" ON public.site_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage experiences" ON public.experiences FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage education" ON public.education FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage skills" ON public.skills FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profile policies
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 13. Storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');
CREATE POLICY "Admins upload site-images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site-images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site-images" ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- 14. Seed initial content
INSERT INTO public.site_content (key, value) VALUES
  ('hero_title', 'Ahmed Shehta Zoghli'),
  ('hero_role', 'Data Analyst'),
  ('hero_tagline', 'Transforming raw data into actionable insights. Skilled in Excel, Python, Power BI, Machine Learning, and Statistical Analysis.'),
  ('contact_email', 'ahmedzogly26@gmail.com'),
  ('contact_phone', '01097401429'),
  ('contact_location', 'Cairo, Egypt'),
  ('contact_linkedin', 'https://www.linkedin.com/in/ahmed-shehta-zoghli'),
  ('summary', 'Data Analyst with 2 years of self-learning experience, currently a Trainee in the Digilians initiative, implemented by the Ministry of Communications and Information Technology (MCIT) in collaboration with the Egyptian Military Academy. Selected for this national program focused on Data Analysis and Artificial Intelligence. Skilled in Microsoft Excel, Statistical Data Analysis, Database Design, Python, Power BI, Machine Learning, Tableau, Google Sheets, and IBM SPSS Statistics, with a strong focus on transforming data into actionable insights.'),
  ('promo_title', 'Want a Portfolio Like This?'),
  ('promo_subtitle', 'I build modern, animated portfolios that showcase your work beautifully. Get yours today.'),
  ('promo_cta_text', 'Contact Me'),
  ('promo_cta_link', 'mailto:ahmedzogly26@gmail.com');

INSERT INTO public.experiences (title, company, period, bullets, display_order) VALUES
  ('Graduate Accountant', 'Trainee — Digilians', 'Dec 2025 — Sep 2026',
   ARRAY[
     'Developing practical skills in Data Analysis, Statistical Analysis, Database Design, Python, Power BI, Machine Learning.',
     'Hands-on experience in transforming raw data into interactive dashboards and reports.',
     'Learning to apply AI and data-driven solutions to real-world business problems.',
     'Analyze financial data using Microsoft Excel to identify trends and variances in revenues and expenses.',
     'Prepare simplified financial reports and dashboards illustrating financial performance.',
     'Assist in reconciling accounts, focusing on variance analysis.',
     'Use analytical thinking to support financial and managerial decisions.'
   ], 0);

INSERT INTO public.education (degree, school, period, description, display_order) VALUES
  ('Bachelor of Commerce in Accounting', 'Mansoura University', 'Sep 2019 — Oct 2023',
   'Financial Accounting, Management Accounting, Business Statistics', 0);

INSERT INTO public.projects (title, description, image_url, display_order) VALUES
  ('Database Design — PageTurners Bookstore', 'Designed a relational database with Sales, Customers, Books, and Sale_Details tables using SQL Server.', '/src/assets/project-db.png', 1),
  ('HR Performance Analysis Dashboard', 'Interactive Power BI dashboard analyzing 300 employees across departments, genders, and salary distributions.', '/src/assets/project-hr2.png', 2),
  ('HR Analytics — Employee Money Transfer', 'Detailed breakdown of employee money transfer methods with bar chart visualization.', '/src/assets/project-hr1.png', 3),
  ('HR Analytics — Full Overview', 'Comprehensive performance analysis with geographic mapping and hiring trends.', '/src/assets/project-hr3.png', 4),
  ('Pizza Sales Dashboard — Excel', 'Excel dashboard analyzing $817K+ in pizza sales across sizes, categories, and monthly trends.', '/src/assets/project-pizza1.png', 5),
  ('Pizza Sales Dashboard — Power BI', 'Power BI version with interactive slicers for pizza size, category, and quantity analysis.', '/src/assets/project-pizza2.png', 6),
  ('Data Analytics Overview', 'Traffic analysis dashboard with visitor insights, page views, and content performance metrics.', '/src/assets/project-analysis.jpg', 7),
  ('SEO Performance Dashboard', 'SEO metrics tracking organic traffic growth, keyword rankings, backlinks, and domain authority.', '/src/assets/project-seo.png', 8),
  ('Customer Churn Analysis — EDA', 'Exploratory data analysis of customer churn with distribution, gender, contract type, and internet service breakdowns.', '/src/assets/project-churn1.png', 9),
  ('Customer Churn — ML Models', 'Machine Learning model comparison (Logistic Regression vs Random Forest) with ROC curves, confusion matrix, and feature importance.', '/src/assets/project-churn2.png', 10),
  ('Customer Churn — Key Insights', 'Python-based churn analysis with key insights: 26.5% churn rate, high-risk segments identification, and actionable recommendations.', '/src/assets/project-churn3.png', 11);

INSERT INTO public.skills (category, items, display_order) VALUES
  ('Data Analysis & BI', ARRAY['Microsoft Excel (Pivot Tables, VLOOKUP, Power Query)', 'Power BI', 'Tableau', 'Google Sheets', 'IBM SPSS Statistics'], 1),
  ('Programming & ML', ARRAY['Python', 'pandas', 'numpy', 'matplotlib', 'Machine Learning'], 2),
  ('Accounting & Finance', ARRAY['Financial Accounting', 'Journal Entries', 'Reconciliations', 'Reporting'], 3),
  ('Soft Skills', ARRAY['Analytical Thinking', 'Attention to Detail', 'Problem-Solving', 'Teamwork', 'Time Management'], 4);
