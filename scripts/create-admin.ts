import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || 'Admin';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.error(`Error: User with email ${email} already exists.`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log(`Successfully created ADMIN user: ${admin.email}`);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
