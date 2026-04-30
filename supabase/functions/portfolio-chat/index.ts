// Portfolio AI Chatbot — streams responses via Lovable AI Gateway
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Guard against credit-abuse via oversized input
    const MAX_MESSAGES = 20;
    const MAX_CHARS = 2000;
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const safeMessages = messages.slice(-MAX_MESSAGES).map((m: any) => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: typeof m?.content === "string" ? m.content.slice(0, MAX_CHARS) : "",
    }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Pull live portfolio context so the bot answers from real data
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );
    const [content, exp, edu, projects, skills, certs] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("experiences").select("title, company, period, bullets").order("display_order"),
      supabase.from("education").select("degree, school, period, description").order("display_order"),
      supabase.from("projects").select("title, description, category, link").order("display_order"),
      supabase.from("skills").select("category, items").order("display_order"),
      supabase.from("certificates").select("title, issuer, description, link").order("display_order"),
    ]);

    const contentMap: Record<string, string> = {};
    (content.data ?? []).forEach((r: any) => (contentMap[r.key] = r.value));

    const systemPrompt = `You are a friendly, concise AI assistant for the personal portfolio of ${contentMap.hero_title ?? "Ahmed"}.
Answer questions about the owner using ONLY the data below. If asked something unrelated, gently redirect to the portfolio.
Keep replies short (2-4 sentences). Use markdown lightly. Detect language (Arabic or English) and reply in the same language.

OWNER PROFILE:
- Name: ${contentMap.hero_title ?? ""}
- Role: ${contentMap.hero_role ?? ""}
- Tagline: ${contentMap.hero_tagline ?? ""}
- About: ${contentMap.summary ?? ""}
- Email: ${contentMap.contact_email ?? ""}
- Phone: ${contentMap.contact_phone ?? ""}
- Location: ${contentMap.contact_location ?? ""}
- LinkedIn: ${contentMap.contact_linkedin ?? ""}

EXPERIENCE:
${(exp.data ?? []).map((e: any) => `- ${e.title} @ ${e.company} (${e.period}): ${e.bullets?.join("; ")}`).join("\n")}

EDUCATION:
${(edu.data ?? []).map((e: any) => `- ${e.degree}, ${e.school} (${e.period})${e.description ? ` — ${e.description}` : ""}`).join("\n")}

PROJECTS:
${(projects.data ?? []).map((p: any) => `- ${p.title} [${p.category}]: ${p.description}${p.link ? ` (${p.link})` : ""}`).join("\n")}

SKILLS:
${(skills.data ?? []).map((s: any) => `- ${s.category}: ${s.items?.join(", ")}`).join("\n")}

CERTIFICATES:
${(certs.data ?? []).map((c: any) => `- ${c.title} — ${c.issuer}${c.link ? ` (${c.link})` : ""}`).join("\n")}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable Cloud." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`AI gateway error: ${txt}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("portfolio-chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
