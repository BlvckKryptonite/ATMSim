import jsPDF from 'jspdf';

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
ATMSim
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
Thank you for using ATMSim
  `.trim();
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 120] // ATM receipt size (80mm wide, 120mm tall)
  });

  // Set font
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);

  let yPosition = 15;
  const lineHeight = 4;
  const centerX = 40; // Center of 80mm width

  // Header - ATMSim logo/text
  doc.setFontSize(14);
  doc.setFont('courier', 'bold');
  doc.text('ATMSim', centerX, yPosition, { align: 'center' });
  yPosition += lineHeight + 2;

  doc.setFontSize(8);
  doc.setFont('courier', 'normal');
  doc.text('TRANSACTION RECEIPT', centerX, yPosition, { align: 'center' });
  yPosition += lineHeight + 3;

  // Separator line
  doc.text('========================', centerX, yPosition, { align: 'center' });
  yPosition += lineHeight + 3;

  // Transaction details
  doc.setFontSize(9);
  const details = [
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`,
    `Amount: $${data.amount}`,
    `Account: ${data.accountNumber}`,
    `New Balance: $${data.newBalance}`,
    `Ref ID: ${data.referenceId}`
  ];

  details.forEach((detail) => {
    doc.text(detail, 5, yPosition);
    yPosition += lineHeight + 1;
  });

  yPosition += 3;
  
  // Footer separator
  doc.text('========================', centerX, yPosition, { align: 'center' });
  yPosition += lineHeight + 2;

  // Footer message
  doc.setFontSize(8);
  doc.text('Thank you for using ATMSim', centerX, yPosition, { align: 'center' });
  yPosition += lineHeight + 2;
  doc.text('Designed and Developed by Muma K.', centerX, yPosition, { align: 'center' });

  return doc;
}

export function downloadReceiptPDF(data: ReceiptData): void {
  const doc = generateReceiptPDF(data);
  doc.save(`ATMSim_Receipt_${data.referenceId}.pdf`);
}

export function downloadReceiptText(data: ReceiptData): void {
  const receiptText = generateReceiptText(data);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `ATMSim_Receipt_${data.referenceId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Default export function for backwards compatibility (now downloads PDF)
export function downloadReceipt(data: ReceiptData): void {
  downloadReceiptPDF(data);
}
