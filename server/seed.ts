import { db } from "./db";
import { users, transactions } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

async function seedDatabase() {
  console.log("Seeding database...");

  // Check if users already exist
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  // Create demo users
  const demoUsers = [
    {
      username: "demo1",
      pin: "1234",
      name: "John Smith",
      accountNumber: "****1234",
      balance: "2548.76"
    },
    {
      username: "demo2",
      pin: "5678",
      name: "Jane Doe",
      accountNumber: "****5678",
      balance: "1875.50"
    },
    {
      username: "muma",
      pin: "9999",
      name: "Muma Kalobwe",
      accountNumber: "****9999",
      balance: "5432.10"
    },
    {
      username: "alex",
      pin: "7890",
      name: "Alex Johnson",
      accountNumber: "****7890",
      balance: "3210.25"
    },
    {
      username: "sarah",
      pin: "4567",
      name: "Sarah Williams",
      accountNumber: "****4567",
      balance: "1987.65"
    }
  ];

  // Insert users
  const insertedUsers = await db.insert(users).values(demoUsers).returning();
  console.log(`Created ${insertedUsers.length} demo users`);

  // Create demo transactions for each user
  const demoTransactions = [];
  let txCounter = 1;

  for (const user of insertedUsers) {
    // Add a deposit transaction
    demoTransactions.push({
      userId: user.id,
      type: "deposit" as const,
      amount: "500.00",
      balanceAfter: user.balance,
      referenceId: `TXN${String(txCounter++).padStart(6, '0')}`
    });

    // Add a withdrawal transaction (from yesterday)
    const balanceAfterWithdrawal = (parseFloat(user.balance) - 200).toFixed(2);
    demoTransactions.push({
      userId: user.id,
      type: "withdrawal" as const,
      amount: "200.00",
      balanceAfter: balanceAfterWithdrawal,
      referenceId: `TXN${String(txCounter++).padStart(6, '0')}`
    });
  }

  // Insert transactions
  const insertedTransactions = await db.insert(transactions).values(demoTransactions).returning();
  console.log(`Created ${insertedTransactions.length} demo transactions`);

  console.log("Database seeding completed!");
}

// Run if this file is executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };