import { connectDB, disconnectDB } from './connection.js';
import { UserModel } from '../modules/users/user.model.js';
import { hashPassword } from '../utils/encryption.js';
import { logger } from '../lib/logger.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('[Seed] Seeding database...');

    // Clear existing users
    await UserModel.deleteMany({});

    const hashedPassword = await hashPassword('password123');

    // Create Admin User
    await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    // Create Standard User
    await UserModel.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      isActive: true,
    });

    logger.info('[Seed] Database seeded successfully!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('[Seed] Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
