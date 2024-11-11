import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LongBillDialog from "./LongBillDialog";
import { LongBill } from "@/pages/Index";

interface LongBillListProps {
  selectedMealPlanId: string | null;
}

const LongBillList = ({ selectedMealPlanId }: LongBillListProps) => {
  const [selectedBill, setSelectedBill] = useState<LongBill | null>(null);
  const [bills, setBills] = useState<LongBill[]>([
    // Sample data
    {
      id: "1",
      title: "January Meal Plan",
      amount: 1250.00,
      date: "2024-01-15",
      mealPlanId: "1"
    },
  ]);

  const filteredBills = selectedMealPlanId
    ? bills.filter((bill) => bill.mealPlanId === selectedMealPlanId)
    : [];

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Long Bills</h2>
      
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="grid grid-cols-1 gap-4">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-app-blue cursor-pointer transition-colors"
              onClick={() => setSelectedBill(bill)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{bill.title}</h3>
                  <p className="text-sm text-gray-500">{bill.date}</p>
                </div>
                <p className="text-lg font-semibold text-app-blue">
                  ${bill.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <LongBillDialog
        bill={selectedBill}
        open={!!selectedBill}
        onOpenChange={(open) => !open && setSelectedBill(null)}
      />
    </div>
  );
};

export default LongBillList;