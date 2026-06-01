import { NextRequest, NextResponse } from "next/server";
import { getCommentsByPost, createComment } from "@/lib/store";
import { getRandomIdentity } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = getCommentsByPost(id);
  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { content, sessionToken, area } = body;

  if (!content || !sessionToken) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (content.length > 300) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const identity = getRandomIdentity(area || "All SA");
  const comment = createComment({
    postId: id,
    content,
    identity,
    sessionToken,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ comment }, { status: 201 });
}
