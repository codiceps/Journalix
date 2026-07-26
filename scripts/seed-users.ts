import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Active user
  await prisma.user.upsert({
    where: { email: 'active@example.com' },
    update: {},
    create: {
      email: 'active@example.com',
      name: 'Active User',
      password,
      role: 'TRADER',
      status: 'ACTIVE',
    },
  });

  // Pending user
  await prisma.user.upsert({
    where: { email: 'pending@example.com' },
    update: {},
    create: {
      email: 'pending@example.com',
      name: 'Pending User',
      password,
      role: 'TRADER',
      status: 'PENDING',
    },
  });

  // Rejected user
  await prisma.user.upsert({
    where: { email: 'rejected@example.com' },
    update: {},
    create: {
      email: 'rejected@example.com',
      name: 'Rejected User',
      password,
      role: 'TRADER',
      status: 'REJECTED',
    },
  });

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('Seed completed: Created active, pending, and rejected users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
