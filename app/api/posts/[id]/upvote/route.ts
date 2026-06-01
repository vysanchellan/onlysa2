import { NextRequest, NextResponse } from "next/server";
import { upvotePost } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { sessionToken } = body;

  if (!sessionToken) {
    return NextResponse.json({ error: "Session required" }, { status: 400 });
  }

  const post = upvotePost(id, sessionToken);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    upvotes: post.upvotes,
    upvoted: (post.upvotedBy || []).includes(sessionToken),
  });
}
