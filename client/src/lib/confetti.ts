import confetti from 'canvas-confetti';

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: ('square' | 'circle')[];
}

export function triggerConfetti(options: ConfettiOptions = {}) {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED'],
    shapes: ['square' as const, 'circle' as const]
  };

  const config = { ...defaults, ...options };

  confetti({
    ...config,
    startVelocity: 30,
    gravity: 0.8,
    drift: 0,
    ticks: 60,
    scalar: 0.8
  });
}

export function triggerSuccessConfetti() {
  // ATM-themed colors (blues and greens for financial success)
  const atmColors = ['#1E40AF', '#059669', '#0891B2', '#0D9488', '#2563EB'];
  
  // Multiple bursts for more excitement
  triggerConfetti({
    particleCount: 50,
    spread: 60,
    origin: { x: 0.25, y: 0.6 },
    colors: atmColors
  });

  setTimeout(() => {
    triggerConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.75, y: 0.6 },
      colors: atmColors
    });
  }, 200);

  setTimeout(() => {
    triggerConfetti({
      particleCount: 30,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors: atmColors
    });
  }, 400);
}

export function triggerDepositConfetti() {
  // Green-themed for deposits (money coming in)
  const depositColors = ['#059669', '#10B981', '#34D399', '#6EE7B7'];
  
  triggerConfetti({
    particleCount: 80,
    spread: 90,
    origin: { x: 0.5, y: 0.7 },
    colors: depositColors,
    shapes: ['circle']
  });
}

export function triggerWithdrawalConfetti() {
  // Blue-themed for withdrawals (professional banking)
  const withdrawalColors = ['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA'];
  
  triggerConfetti({
    particleCount: 60,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
    colors: withdrawalColors,
    shapes: ['square']
  });
}