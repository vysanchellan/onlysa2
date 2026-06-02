import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const hasUrl = !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = !!(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const client = getSupabase();
  if (!client) {
    return NextResponse.json({
      status: "degraded",
      supabase: false,
      env: { url: hasUrl, key: hasKey },
      hint: hasUrl && hasKey
        ? "Env vars found but client failed to init — check they are valid"
        : "Set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_ variants) in Vercel env vars, then redeploy",
    });
  }

  const { data, error, count } = await client
    .from("posts")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({
      status: "error",
      supabase: true,
      error: error.message,
      hint: "Check your RLS policies in the SQL Editor — run supabase-schema.sql again",
    });
  }

  const { data: dbPosts } = await client.from("posts").select("*").limit(1);

  return NextResponse.json({
    status: "ok",
    supabase: true,
    postCount: count ?? 0,
    hasCustomPosts: (count ?? 0) > 12,
    env: { url: hasUrl, key: hasKey },
    sampleColumns: dbPosts?.length ? Object.keys(dbPosts[0]) : [],
  });
}
