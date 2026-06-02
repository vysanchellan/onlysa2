import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const client = getSupabase();
  if (!client) {
    return NextResponse.json({
      status: "degraded",
      supabase: false,
      message: "Supabase env vars not configured — using in-memory fallback",
    });
  }

  const { data, error } = await client.from("posts").select("id", { count: "exact", head: true });
  if (error) {
    return NextResponse.json({
      status: "error",
      supabase: true,
      error: error.message,
      message: "Supabase connected but query failed — check schema",
    });
  }

  return NextResponse.json({
    status: "ok",
    supabase: true,
    postCount: data?.length ?? 0,
    message: "Supabase connected and working",
  });
}
