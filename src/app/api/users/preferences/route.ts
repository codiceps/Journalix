import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validasi payload
    const updateData: any = {};
    if (typeof body.isDarkMode === 'boolean') updateData.isDarkMode = body.isDarkMode;
    if (typeof body.emailNotifications === 'boolean') updateData.emailNotifications = body.emailNotifications;
    if (typeof body.isPublicProfile === 'boolean') updateData.isPublicProfile = body.isPublicProfile;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences: {
        isDarkMode: updatedUser.isDarkMode,
        emailNotifications: updatedUser.emailNotifications,
        isPublicProfile: updatedUser.isPublicProfile,
      }
    });

  } catch (error) {
    console.error("Preferences PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
