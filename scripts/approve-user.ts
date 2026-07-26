import prisma from '../src/lib/prisma';

// PENTING: Script ini sekarang sudah digantikan oleh fitur Panel Admin UI (Sprint 9).
// Script ini dipertahankan HANYA sebagai fallback CLI jika UI bermasalah.

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx tsx scripts/approve-user.ts <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });
    console.log(`Successfully approved user: ${user.email}`);
  } catch (error) {
    console.error('Error approving user:', error instanceof Error ? error.message : error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
