import { Button } from "@/components/ui/button";
import { downloadReceipt, type ReceiptData } from "@/lib/pdf-generator";
import { CheckCircle, Download } from "lucide-react";

interface ReceiptModalProps {
  data: ReceiptData;
  onClose: () => void;
}

export function ReceiptModal({ data, onClose }: ReceiptModalProps) {
  const handleDownload = () => {
    downloadReceipt(data);
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Successful</h3>
          <p className="text-sm text-gray-600">Your transaction has been completed</p>
        </div>

        {/* Receipt Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm">
          <div className="text-center border-b border-gray-300 pb-3 mb-3">
            <h4 className="font-bold">ATMVault</h4>
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

        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
