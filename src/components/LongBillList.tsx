import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LongBillDialog from "./LongBillDialog";
import { LongBill } from "@/pages/Index";
import { useToast } from "@/components/ui/use-toast";
import { Calendar , Building } from "lucide-react";

interface LongBillListProps {
  selectedMealPlanId: string | null;
}

const LongBillList = ({ selectedMealPlanId }: LongBillListProps) => {
  const [selectedBill, setSelectedBill] = useState<LongBill | null>(null);
  const [bills, setBills] = useState<LongBill[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLongBills = async () => {
      if (!selectedMealPlanId) {
        setBills([]);
        return;
      }

      try {
        const formData = new URLSearchParams();
        formData.append("meal_plan_id", selectedMealPlanId);

        const response = await fetch("http://10.0.10.46/api/r/QueryLongBillList", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Long Bills:", data);
          setBills(data); // Assuming data is an array of LongBill items
          toast({
            title: "Success",
            description: "Long bills loaded successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch long bills.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Error fetching long bills: ${(error as Error).message}`,
          variant: "destructive",
        });
        console.error("Fetch Long Bills Error:", error);
      }
    };

    fetchLongBills();
  }, [selectedMealPlanId, toast]);

  console.log("Selected Meal Plan ID:", selectedMealPlanId);

  const filteredBills = selectedMealPlanId
    ? bills.filter((bill) => String(bill.mealPlanId || bill.meal_plan_id) === String(selectedMealPlanId))
    : [];

  console.log("Filtered Bills:", filteredBills);

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Long Bills</h2>
      
      <ScrollArea className="h-[calc(100%-2rem)]">
        {filteredBills.length === 0 ? (
          <p className="text-gray-500 text-center">No bills available for this meal plan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-app-blue cursor-pointer transition-colors"
                onClick={() => setSelectedBill(bill)}
              >
                <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg flex  items-center " >LB-{bill.id} - {bill.company_name} </h3>
                  <p className="text-sm text-gray-500 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{bill.event_date} | Event ID - {bill.event_id}  {bill.event_name} | {bill.venue}</span>
                  </p>
                </div>

                  <p className="text-lg font-semibold text-app-blue">
                    ${bill.amount ? bill.amount.toFixed(2) : "0.00"} 
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Dialog for the selected long bill */}
      <LongBillDialog
        bill={selectedBill}
        open={selectedBill !== null}
        onOpenChange={(open) => !open && setSelectedBill(null)}
      />
    </div>
  );
};

export default LongBillList;
