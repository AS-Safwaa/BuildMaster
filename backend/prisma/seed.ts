// ─────────────────────────────────────────────────────────
// Database Seed — creates demo users and projects
// Run with: npm run db:seed
// ─────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.config.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@buildmaster.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const developer = await prisma.user.create({
    data: {
      name: 'Developer User',
      email: 'developer@buildmaster.com',
      password: hashedPassword,
      role: 'developer',
    },
  });

  console.log('✅ Users created');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'HeartCare Clinic Website',
      description: 'A modern responsive website for HeartCare Advanced Clinic with appointment booking and doctor profiles.',
      status: 'active',
      createdBy: developer.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Glow & Grace Salon',
      description: 'Elegant landing page for a premium unisex salon with online booking and service catalog.',
      status: 'draft',
      createdBy: developer.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Urban Threads Retail',
      description: 'E-commerce ready website for a menswear brand with product showcase and custom tailoring forms.',
      status: 'completed',
      createdBy: admin.id,
    },
  });

  console.log('✅ Projects created');

  // Create configs
  await prisma.config.createMany({
    data: [
      { key: 'theme', value: 'dark', projectId: project1.id },
      { key: 'primaryColor', value: '#6366f1', projectId: project1.id },
      { key: 'fontFamily', value: 'Inter', projectId: project1.id },
      { key: 'theme', value: 'light', projectId: project2.id },
      { key: 'primaryColor', value: '#ec4899', projectId: project2.id },
      { key: 'layout', value: 'sidebar', projectId: project3.id },
      { key: 'primaryColor', value: '#0ea5e9', projectId: project3.id },
    ],
  });

  console.log('✅ Configs created');
  console.log('');
  console.log('📧 Demo Accounts:');
  console.log('   Admin:     admin@buildmaster.com     / password123');
  console.log('   Developer: developer@buildmaster.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
