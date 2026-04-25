import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSiteContent, useExperiences, useEducation, useProjects, useSkills } from "@/hooks/use-site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, LogOut, Upload } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { content, refetch: refetchContent } = useSiteContent();
  const { items: experiences, refetch: refetchExp } = useExperiences();
  const { items: education, refetch: refetchEdu } = useEducation();
  const { items: projects, refetch: refetchProj } = useProjects();
  const { items: skills, refetch: refetchSkills } = useSkills();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3">Admin access required</h2>
          <p className="text-muted-foreground mb-6">
            Your account is not yet an admin. Sign in with your account, then ask the site owner (or run a one-time SQL) to grant the <code className="bg-muted px-1 rounded">admin</code> role to your user ID:
          </p>
          <code className="block bg-muted p-3 rounded text-xs break-all mb-6">{user.id}</code>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => signOut().then(() => navigate("/"))}>Sign out</Button>
            <Button onClick={() => navigate("/")}>Back home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-20">
        <div className="container max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Site Admin</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>View Site</Button>
            <Button variant="outline" size="sm" onClick={() => signOut().then(() => navigate("/"))}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl px-6 py-10">
        <Tabs defaultValue="content">
          <TabsList className="mb-8 flex-wrap h-auto">
            <TabsTrigger value="content">General</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experiences">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="content"><ContentEditor content={content} onSaved={refetchContent} /></TabsContent>
          <TabsContent value="projects"><ProjectsEditor items={projects} onChanged={refetchProj} /></TabsContent>
          <TabsContent value="experiences"><ExperiencesEditor items={experiences} onChanged={refetchExp} /></TabsContent>
          <TabsContent value="education"><EducationEditor items={education} onChanged={refetchEdu} /></TabsContent>
          <TabsContent value="skills"><SkillsEditor items={skills} onChanged={refetchSkills} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* ---------- Content (key/value) ---------- */
const CONTENT_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "hero_title", label: "Hero — Name" },
  { key: "hero_role", label: "Hero — Role" },
  { key: "hero_tagline", label: "Hero — Tagline", multiline: true },
  { key: "summary", label: "Summary", multiline: true },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_location", label: "Contact Location" },
  { key: "contact_linkedin", label: "LinkedIn URL" },
  { key: "promo_title", label: "Promo — Title" },
  { key: "promo_subtitle", label: "Promo — Subtitle", multiline: true },
  { key: "promo_cta_text", label: "Promo — Button Text" },
  { key: "promo_cta_link", label: "Promo — Button Link" },
];

const ContentEditor = ({ content, onSaved }: { content: Record<string, string>; onSaved: () => void }) => {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { setDraft(content); }, [content]);

  const save = async () => {
    setSaving(true);
    try {
      const rows = Object.entries(draft).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
      if (error) throw error;
      toast.success("Content saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Card className="p-6 space-y-5">
      {CONTENT_FIELDS.map((f) => (
        <div key={f.key} className="space-y-2">
          <Label>{f.label}</Label>
          {f.multiline ? (
            <Textarea rows={4} value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
          ) : (
            <Input value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
          )}
        </div>
      ))}
      <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Changes</Button>
    </Card>
  );
};

/* ---------- Projects ---------- */
const ProjectsEditor = ({ items, onChanged }: { items: any[]; onChanged: () => void }) => {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Project</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex gap-3">
              <img src={p.image_url.startsWith("http") ? p.image_url : ""} alt="" className="w-20 h-20 object-cover rounded bg-muted" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Order: {p.display_order}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-3 h-3 mr-1" />Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <ProjectDialog open={open} onOpenChange={setOpen} project={editing} onSaved={() => { setOpen(false); onChanged(); }} />
    </div>
  );
};

const ProjectDialog = ({ open, onOpenChange, project, onSaved }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(project?.title ?? "");
    setDescription(project?.description ?? "");
    setImageUrl(project?.image_url ?? "");
    setOrder(project?.display_order ?? 0);
  }, [project, open]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `projects/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded");
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { title, description, image_url: imageUrl, display_order: order };
      const { error } = project
        ? await supabase.from("projects").update(payload).eq("id", project.id)
        : await supabase.from("projects").insert(payload);
      if (error) throw error;
      toast.success("Saved");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div>
            <Label>Image</Label>
            {imageUrl && <img src={imageUrl.startsWith("http") ? imageUrl : ""} alt="" className="w-full h-32 object-cover rounded mb-2 bg-muted" />}
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span className="text-sm">{uploading ? "Uploading..." : "Upload image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            </label>
          </div>
          <div><Label>Display Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving || !title || !imageUrl}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ---------- Experiences ---------- */
const ExperiencesEditor = ({ items, onChanged }: { items: any[]; onChanged: () => void }) => {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Experience</Button></div>
      {items.map((it) => (
        <Card key={it.id} className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm text-primary">{it.company}</p>
              <p className="text-xs text-muted-foreground">{it.period}</p>
              <ul className="text-xs text-muted-foreground mt-2 list-disc pl-4 space-y-1">
                {it.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(it); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => remove(it.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        </Card>
      ))}
      <ExperienceDialog open={open} onOpenChange={setOpen} item={editing} onSaved={() => { setOpen(false); onChanged(); }} />
    </div>
  );
};

const ExperienceDialog = ({ open, onOpenChange, item, onSaved }: any) => {
  const [title, setTitle] = useState(""); const [company, setCompany] = useState("");
  const [period, setPeriod] = useState(""); const [bullets, setBullets] = useState("");
  const [order, setOrder] = useState(0); const [saving, setSaving] = useState(false);
  useEffect(() => {
    setTitle(item?.title ?? ""); setCompany(item?.company ?? "");
    setPeriod(item?.period ?? ""); setBullets((item?.bullets ?? []).join("\n"));
    setOrder(item?.display_order ?? 0);
  }, [item, open]);
  const save = async () => {
    setSaving(true);
    try {
      const payload = { title, company, period, bullets: bullets.split("\n").filter(Boolean), display_order: order };
      const { error } = item
        ? await supabase.from("experiences").update(payload).eq("id", item.id)
        : await supabase.from("experiences").insert(payload);
      if (error) throw error;
      toast.success("Saved"); onSaved();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit" : "New"} Experience</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          <div><Label>Period</Label><Input value={period} onChange={(e) => setPeriod(e.target.value)} /></div>
          <div><Label>Bullets (one per line)</Label><Textarea rows={5} value={bullets} onChange={(e) => setBullets(e.target.value)} /></div>
          <div><Label>Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
        </div>
        <DialogFooter><Button onClick={save} disabled={saving}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ---------- Education ---------- */
const EducationEditor = ({ items, onChanged }: { items: any[]; onChanged: () => void }) => {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Education</Button></div>
      {items.map((it) => (
        <Card key={it.id} className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{it.degree}</h3>
              <p className="text-sm text-primary">{it.school}</p>
              <p className="text-xs text-muted-foreground">{it.period}</p>
              {it.description && <p className="text-sm text-muted-foreground mt-2">{it.description}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(it); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => remove(it.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        </Card>
      ))}
      <EducationDialog open={open} onOpenChange={setOpen} item={editing} onSaved={() => { setOpen(false); onChanged(); }} />
    </div>
  );
};

const EducationDialog = ({ open, onOpenChange, item, onSaved }: any) => {
  const [degree, setDegree] = useState(""); const [school, setSchool] = useState("");
  const [period, setPeriod] = useState(""); const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0); const [saving, setSaving] = useState(false);
  useEffect(() => {
    setDegree(item?.degree ?? ""); setSchool(item?.school ?? "");
    setPeriod(item?.period ?? ""); setDescription(item?.description ?? "");
    setOrder(item?.display_order ?? 0);
  }, [item, open]);
  const save = async () => {
    setSaving(true);
    try {
      const payload = { degree, school, period, description, display_order: order };
      const { error } = item
        ? await supabase.from("education").update(payload).eq("id", item.id)
        : await supabase.from("education").insert(payload);
      if (error) throw error;
      toast.success("Saved"); onSaved();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit" : "New"} Education</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Degree</Label><Input value={degree} onChange={(e) => setDegree(e.target.value)} /></div>
          <div><Label>School</Label><Input value={school} onChange={(e) => setSchool(e.target.value)} /></div>
          <div><Label>Period</Label><Input value={period} onChange={(e) => setPeriod(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><Label>Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
        </div>
        <DialogFooter><Button onClick={save} disabled={saving}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ---------- Skills ---------- */
const SkillsEditor = ({ items, onChanged }: { items: any[]; onChanged: () => void }) => {
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Skill Group</Button></div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <Card key={it.id} className="p-4">
            <h3 className="font-semibold text-primary text-sm uppercase tracking-wider mb-2">{it.category}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {it.items.map((s: string, i: number) => <span key={i} className="px-2 py-0.5 bg-secondary text-xs rounded">{s}</span>)}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(it); setOpen(true); }}><Pencil className="w-3 h-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => remove(it.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <SkillDialog open={open} onOpenChange={setOpen} item={editing} onSaved={() => { setOpen(false); onChanged(); }} />
    </div>
  );
};

const SkillDialog = ({ open, onOpenChange, item, onSaved }: any) => {
  const [category, setCategory] = useState(""); const [itemsText, setItemsText] = useState("");
  const [order, setOrder] = useState(0); const [saving, setSaving] = useState(false);
  useEffect(() => {
    setCategory(item?.category ?? ""); setItemsText((item?.items ?? []).join("\n"));
    setOrder(item?.display_order ?? 0);
  }, [item, open]);
  const save = async () => {
    setSaving(true);
    try {
      const payload = { category, items: itemsText.split("\n").map(s => s.trim()).filter(Boolean), display_order: order };
      const { error } = item
        ? await supabase.from("skills").update(payload).eq("id", item.id)
        : await supabase.from("skills").insert(payload);
      if (error) throw error;
      toast.success("Saved"); onSaved();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit" : "New"} Skill Group</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} /></div>
          <div><Label>Items (one per line)</Label><Textarea rows={5} value={itemsText} onChange={(e) => setItemsText(e.target.value)} /></div>
          <div><Label>Order</Label><Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></div>
        </div>
        <DialogFooter><Button onClick={save} disabled={saving}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
