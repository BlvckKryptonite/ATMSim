import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple demo users for production (since database connection is failing)
const demoUsers = [
  { id: 1, username: "demo1", pin: "1234", balance: "1250.75", fullName: "Demo User 1" },
  { id: 2, username: "demo2", pin: "5678", balance: "2100.50", fullName: "Demo User 2" },
  { id: 3, username: "muma", pin: "9999", balance: "5000.00", fullName: "Muma Kalobwe" },
  { id: 4, username: "alex", pin: "7890", balance: "800.25", fullName: "Alex Johnson" },
  { id: 5, username: "sarah", pin: "4567", balance: "3200.80", fullName: "Sarah Williams" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, pin } = req.body;
    
    if (!username || !pin) {
      return res.status(400).json({ message: 'Username and PIN are required' });
    }

    const user = demoUsers.find(u => u.username === username && u.pin === pin);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or PIN' });
    }

    // Don't send PIN back to client
    const { pin: _, ...userWithoutPin } = user;
    res.json({ user: userWithoutPin });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Authentication failed' 
    });
  }
}