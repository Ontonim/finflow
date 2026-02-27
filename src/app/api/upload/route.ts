import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ImgBB API key not configured" }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Forward to ImgBB
    const imgbbForm = new URLSearchParams();
    imgbbForm.append("key", apiKey);
    imgbbForm.append("image", base64);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const result = await imgbbResponse.json();

    if (!imgbbResponse.ok || !result.success) {
      return NextResponse.json(
        { error: result.error?.message || "ImgBB upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
