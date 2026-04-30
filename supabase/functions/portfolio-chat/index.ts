// Portfolio AI Chatbot — streams responses via OpenRouter
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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

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

    const ownerName = contentMap.hero_title ?? "Ahmed Shehta";
    const ownerEmail = contentMap.contact_email ?? "";
    const ownerPhone = contentMap.contact_phone ?? "";
    const ownerLinkedIn = contentMap.contact_linkedin ?? "";

    const systemPrompt = `You are the friendly, professional AI sales assistant for the personal portfolio of ${ownerName} (Data Analyst).
Your TWO main goals:
1) Answer any question about ${ownerName} accurately using ONLY the data below.
2) Encourage the visitor to hire ${ownerName} or contact him to request his services (data analysis, dashboards, BI, reporting, Power BI, Excel, SQL, Python).

GUIDELINES:
- Detect the user's language (Arabic or English) and reply in the SAME language. Default to Arabic if unsure.
- Keep replies concise (2-5 sentences) and warm. Use light markdown (bold, lists, links) when helpful.
- When the user shows ANY interest (asks about services, pricing, hiring, projects, "how can you help me", etc.), naturally invite them to contact ${ownerName} and provide his contact details below as clickable markdown links.
- End most service-related answers with a soft call-to-action like: "تواصل معه الآن عبر..." / "Feel free to reach out via...".
- If asked about something unrelated to the portfolio, gently redirect to ${ownerName}'s services and offer to connect them.
- Never invent facts. If data is missing, say so and suggest contacting ${ownerName} directly.

CONTACT (always use these for CTAs):
- Email: ${ownerEmail}
- Phone / WhatsApp: ${ownerPhone}
- LinkedIn: ${ownerLinkedIn}
- Or use the Contact form on this site.

OWNER PROFILE:
- Name: ${ownerName}
- Role: ${contentMap.hero_role ?? "Data Analyst"}
- Tagline: ${contentMap.hero_tagline ?? ""}
- About: ${contentMap.summary ?? ""}
- Location: ${contentMap.contact_location ?? ""}

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

    const referer = req.headers.get("origin") ?? req.headers.get("referer") ?? "https://create-your-glory.lovable.app";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": referer.replace(/[^\x00-\x7F]/g, ""),
        "X-Title": "Portfolio Chatbot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "OpenRouter credits exhausted." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`OpenRouter error: ${txt}`);
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
