import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const adminId = (session.user as any).id;
    // params is a Promise in Next.js 16 (App Router)
    const resolvedParams = await params;
    const targetUserId = resolvedParams.id;

    if (adminId === targetUserId) {
      return NextResponse.json({ error: "Anda tidak dapat mereset sandi Anda sendiri via endpoint ini." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Generate random 12-char alphanumeric password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    // Return the plaintext password so Admin can share it
    return NextResponse.json({ 
      message: "Password berhasil di-reset", 
      newPassword: newPassword 
    }, { status: 200 });

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}
