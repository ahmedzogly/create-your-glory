import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = Record<string, string>;
export type Experience = { id: string; title: string; company: string; period: string; bullets: string[]; display_order: number };
export type Education = { id: string; degree: string; school: string; period: string; description: string | null; display_order: number };
export type Project = { id: string; title: string; description: string; image_url: string; display_order: number };
export type Skill = { id: string; category: string; items: string[]; display_order: number };

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("key, value");
    if (data) {
      const map: SiteContent = {};
      data.forEach((row) => { map[row.key] = row.value; });
      setContent(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);
  return { content, loading, refetch: fetchContent };
};

export const useExperiences = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const fetch = useCallback(async () => {
    const { data } = await supabase.from("experiences").select("*").order("display_order");
    if (data) setItems(data as Experience[]);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { items, refetch: fetch };
};

export const useEducation = () => {
  const [items, setItems] = useState<Education[]>([]);
  const fetch = useCallback(async () => {
    const { data } = await supabase.from("education").select("*").order("display_order");
    if (data) setItems(data as Education[]);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { items, refetch: fetch };
};

export const useProjects = () => {
  const [items, setItems] = useState<Project[]>([]);
  const fetch = useCallback(async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    if (data) setItems(data as Project[]);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { items, refetch: fetch };
};

export const useSkills = () => {
  const [items, setItems] = useState<Skill[]>([]);
  const fetch = useCallback(async () => {
    const { data } = await supabase.from("skills").select("*").order("display_order");
    if (data) setItems(data as Skill[]);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { items, refetch: fetch };
};
