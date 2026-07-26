import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: "Anda tidak dapat mengubah status akun Anda sendiri." }, { status: 400 });
    }

    const body = await req.json();
    const newStatus = body.status;

    if (!['ACTIVE', 'REJECTED'].includes(newStatus)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Validasi transisi status
    const currentStatus = targetUser.status;
    
    let isValidTransition = false;
    if (currentStatus === 'PENDING' && (newStatus === 'ACTIVE' || newStatus === 'REJECTED')) {
      isValidTransition = true;
    } else if (currentStatus === 'ACTIVE' && newStatus === 'REJECTED') {
      isValidTransition = true;
    } else if (currentStatus === 'REJECTED' && newStatus === 'ACTIVE') {
      isValidTransition = true;
    }

    if (!isValidTransition) {
      return NextResponse.json({ error: `Transisi status dari ${currentStatus} ke ${newStatus} tidak diizinkan.` }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      message: "Status updated successfully",
      user: { id: updatedUser.id, status: updatedUser.status }
    });

  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
