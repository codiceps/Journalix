import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid user ID" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate unique path
    const extension = file.type.split('/')[1];
    const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
    const filePath = `${userId}/${fileName}`;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.storage
        .from('trade-screenshots')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
      }

      return NextResponse.json({ path: data.path }, { status: 201 });
    } catch (err: any) {
      console.error("Supabase init error:", err);
      return NextResponse.json({ error: "Storage configuration error" }, { status: 500 });
    }

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
