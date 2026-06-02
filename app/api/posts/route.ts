import { NextRequest, NextResponse } from "next/server";
import { getTrendingPosts, getPostsByArea, createPost } from "@/lib/store";
import { getRandomIdentity } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "recent";
  const area = searchParams.get("area") || "All SA";

  let posts;
  if (tab === "trending") {
    posts = await getTrendingPosts();
    if (area !== "All SA") posts = posts.filter((p) => p.area === area);
  } else if (tab === "top-rated") {
    const { getTopRatedPosts } = await import("@/lib/store");
    posts = await getTopRatedPosts();
    if (area !== "All SA") posts = posts.filter((p) => p.area === area);
  } else {
    posts = await getPostsByArea(area);
  }

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, category, content, sessionToken, gifUrl, gifPreview } = body;

    if (!area || !category || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Content too long" },
        { status: 400 }
      );
    }

    const identity = getRandomIdentity(area);
    const post = await createPost({
      area,
      category,
      content,
      identity,
      sessionToken: sessionToken || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...(gifUrl ? { gifUrl, gifPreview } : {}),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
