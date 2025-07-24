import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.status(200).json({ 
      status: "ok", 
      message: "ATMSim API is working",
      timestamp: new Date().toISOString(),
      method: req.method
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}