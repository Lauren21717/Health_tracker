import { prisma } from './src/index';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: hashedPassword,
      name: 'Test User',
      dob: new Date('1990-01-01'),
      gender: 'other',
    },
  });

  console.log('Created user:', user);

  // Create some sample daily metrics
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.dailyMetric.createMany({
    data: [
      {
        userId: user.id,
        date: yesterday,
        weight: 70.5,
        bodyFatPct: 15.2,
        restingHR: 65,
      },
      {
        userId: user.id,
        date: today,
        weight: 70.3,
        bodyFatPct: 15.1,
        restingHR: 63,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
