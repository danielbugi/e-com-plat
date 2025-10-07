import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log("\n🔐 Admin User Creation Script\n");

    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password (min 6 chars): ");
    const name = await question("Enter admin name: ");

    if (!email || !password || !name) {
      console.error("❌ All fields are required!");
      process.exit(1);
    }

    if (password.length < 6) {
      console.error("❌ Password must be at least 6 characters!");
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`❌ User with email ${email} already exists!`);

      const updateRole = await question(
        "\nDo you want to update this user to ADMIN role? (yes/no): "
      );

      if (
        updateRole.toLowerCase() === "yes" ||
        updateRole.toLowerCase() === "y"
      ) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { role: "ADMIN" },
        });

        console.log("\n✅ User role updated to ADMIN successfully!");
        console.log(`\nAdmin Details:`);
        console.log(`- Email: ${updatedUser.email}`);
        console.log(`- Name: ${updatedUser.name}`);
        console.log(`- Role: ${updatedUser.role}`);
      } else {
        console.log("\n❌ Operation cancelled.");
      }

      rl.close();
      await prisma.$disconnect();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(), // Mark as verified
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`\nAdmin Details:`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Name: ${admin.name}`);
    console.log(`- Role: ${admin.role}`);
    console.log(`- ID: ${admin.id}`);
    console.log(`\nYou can now login at: http://localhost:3000`);
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
