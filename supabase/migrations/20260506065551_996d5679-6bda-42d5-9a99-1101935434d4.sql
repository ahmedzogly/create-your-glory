
-- site_content
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS value_ar text;

-- experiences
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS title_ar text;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS company_ar text;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS bullets_ar text[] DEFAULT '{}'::text[];

-- education
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS degree_ar text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS school_ar text;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS description_ar text;

-- projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title_ar text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description_ar text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category_ar text;

-- skills
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS category_ar text;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS items_ar text[] DEFAULT '{}'::text[];

-- certificates
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS title_ar text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issuer_ar text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS description_ar text;
