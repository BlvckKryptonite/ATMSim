import { Button } from "@/components/ui/button";
import { downloadReceiptPDF, downloadReceiptText, type ReceiptData } from "@/lib/pdf-generator";
import { triggerDepositConfetti, triggerWithdrawalConfetti, triggerConfetti } from "@/lib/confetti";
import { CheckCircle, Download, FileText } from "lucide-react";
import { useEffect } from "react";

interface ReceiptModalProps {
  data: ReceiptData;
  onClose: () => void;
}

export function ReceiptModal({ data, onClose }: ReceiptModalProps) {
  const handleDownloadPDF = () => {
    downloadReceiptPDF(data);
    // Small confetti burst for PDF download
    triggerConfetti({
      particleCount: 30,
      spread: 50,
      origin: { x: 0.35, y: 0.8 },
      colors: ['#1E40AF', '#2563EB', '#3B82F6']
    });
  };

  const handleDownloadText = () => {
    downloadReceiptText(data);
    // Small confetti burst for text download
    triggerConfetti({
      particleCount: 25,
      spread: 45,
      origin: { x: 0.65, y: 0.8 },
      colors: ['#059669', '#10B981', '#34D399']
    });
  };

  // Trigger confetti animation when modal opens
  useEffect(() => {
    const triggerAnimation = () => {
      if (data.type === 'deposit') {
        triggerDepositConfetti();
      } else if (data.type === 'withdrawal') {
        triggerWithdrawalConfetti();
      }
    };

    // Small delay to ensure modal is visible before confetti
    const timer = setTimeout(triggerAnimation, 300);
    return () => clearTimeout(timer);
  }, [data.type]);

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Successful</h3>
          <p className="text-sm text-gray-600">Your transaction has been completed</p>
        </div>

        {/* Receipt Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm">
          <div className="text-center border-b border-gray-300 pb-3 mb-3">
            <img src="/atm-sim-logo.png" alt="ATMSim Logo" className="h-8 mx-auto mb-1" />
            <p className="text-xs">TRANSACTION RECEIPT</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{data.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{data.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{data.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-bold">{formatCurrency(data.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Account:</span>
              <span>{data.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>New Balance:</span>
              <span className="font-bold">{formatCurrency(data.newBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ref ID:</span>
              <span>{data.referenceId}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={handleDownloadText}
              variant="outline"
              className="flex-1 py-3 font-medium flex items-center justify-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full py-3 font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
