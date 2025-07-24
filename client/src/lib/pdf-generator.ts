export interface ReceiptData {
  type: 'deposit' | 'withdrawal';
  amount: string;
  date: string;
  time: string;
  accountNumber: string;
  newBalance: string;
  referenceId: string;
}

export function generateReceiptText(data: ReceiptData): string {
  return `
VaultSim
TRANSACTION RECEIPT
========================

Date: ${data.date}
Time: ${data.time}
Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}
Amount: $${data.amount}
Account: ${data.accountNumber}
New Balance: $${data.newBalance}
Ref ID: ${data.referenceId}

========================
Thank you for using VaultSim
  `.trim();
}

export function downloadReceipt(data: ReceiptData): void {
  const receiptText = generateReceiptText(data);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `VaultSim_Receipt_${data.referenceId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
