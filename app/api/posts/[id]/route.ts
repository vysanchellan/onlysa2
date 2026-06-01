import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
