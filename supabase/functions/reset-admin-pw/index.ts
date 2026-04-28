import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data, error } = await admin.auth.admin.updateUserById(
    "60e980a4-cec7-411f-8bab-b541a7124505",
    { password: "AH234265sh@", email_confirm: true }
  );
  return new Response(JSON.stringify({ ok: !error, error: error?.message, user: data?.user?.email }), {
    headers: { "Content-Type": "application/json" },
  });
});
