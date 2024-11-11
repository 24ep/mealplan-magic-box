import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LongBill } from "@/pages/Index";

interface LongBillDialogProps {
  bill: LongBill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LongBillDialog = ({ bill, open, onOpenChange }: LongBillDialogProps) => {
  if (!bill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-500">Title</h3>
            <p className="text-lg">{bill.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Amount</h3>
            <p className="text-lg text-app-blue font-semibold">
              ${bill.amount.toFixed(2)}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Date</h3>
            <p className="text-lg">{bill.date}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LongBillDialog;