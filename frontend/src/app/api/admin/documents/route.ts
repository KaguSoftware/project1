import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Verify caller is authenticated and is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("app_role")
    .eq("id", user.id)
    .single();

  if (profile?.app_role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Server-side client carries the session cookie — is_admin() RLS passes correctly
  const { data, error } = await supabase
    .from("documents")
    .select("id, owner_id, title, doc_type, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}
