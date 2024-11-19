import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LongBillDialog from "./LongBillDialog";
import ReportDialog from "./ReportDialog"; // Import the ReportDialog
import { LongBill } from "@/pages/Index";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";

interface LongBillListProps {
  selectedMealPlanId: number | null;
}

const LongBillList = ({ selectedMealPlanId }: LongBillListProps) => {
  const [selectedBill, setSelectedBill] = useState<LongBill | null>(null);
  const [bills, setBills] = useState<LongBill[]>([]);
  const { toast } = useToast();
  const [isReportDialogOpen, setReportDialogOpen] = useState(false); // State for the report dialog
  const [reportUrl, setReportUrl] = useState(""); // URL for the report

  // Function to fetch long bills based on the selected meal plan ID
  const fetchLongBills = async () => {
    if (!selectedMealPlanId) {
      setBills([]);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("meal_plan_id", selectedMealPlanId.toString());
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/QueryLongBillList`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setBills(data); // Set the fetched bills
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
    }
  };

  // Fetch bills on load or when selectedMealPlanId changes
  useEffect(() => {
    fetchLongBills();
  }, [selectedMealPlanId]);

  // Function to handle refreshing the bills
  const handleRefresh = () => {
    fetchLongBills(); // Re-fetch the bills
  };

  const filteredMealPlanIdForListPlanType = selectedMealPlanId
  ? bills.filter((bill) => String(bill.meal_plan_id) === String(selectedMealPlanId))[0]?.bill_type_id
  : null;

  const handleGenerateBlankLongBill = () => {
    const newBlankBill: LongBill = {
      id: `temp-${Date.now()}`, // Temporary ID
      meal_plan_id: selectedMealPlanId,
      company_name: "",
      event_date: "",
      event_id: null,
      event_name: "",
      venue: "",
      waiter: null,
      receiver: "",
      receiver_full_name: "",
      signature: "",
      status: 1,
      running_id: null,
      bill_type:filteredMealPlanIdForListPlanType
    };

    setBills((prevBills) => [newBlankBill, ...prevBills]);
    setSelectedBill(newBlankBill); // Automatically open the dialog for the new blank bill

    toast({
      title: "New Long Bill Created",
      description: "A blank long bill has been added and opened.",
    });
  };

  const handleOpenReportDialog = (bill: LongBill) => {
    setReportDialogOpen(true); // Open the report dialog
  };

  const filteredBills = selectedMealPlanId
    ? bills.filter((bill) => String(bill.meal_plan_id) === String(selectedMealPlanId))
    : [];


  

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Long Bills</h2>
        <button
          onClick={handleGenerateBlankLongBill}
          className="px-4 py-2 bg-app-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Blank Long Bill
        </button>
        <button
          onClick={handleOpenReportDialog} // Open report dialog for the selected bill
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Report
 </button>
      </div>

      <ScrollArea className="h-[calc(100%-2rem)]">
        {filteredBills.length === 0 ? (
          <p className="text-gray-500 text-center">No bills available for this meal plan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => setSelectedBill(bill)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {bill.prefix}-{bill.running_id} - {bill.company_name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {bill.event_date} | Event ID - {bill.event_id} {bill.event_name} | {bill.venue}
                      </span>
                    </p>
                    <span
                      className={`mt-2 inline-flex items-center px-2 py-1 rounded text-white ${
                        bill.status === 1 ? 'bg-green-400' : 'bg-red-300'
                      }`}
                    >
                      {bill.status === 1 ? 'Active' : 'Cancelled'}
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-blue-500">
                    ${bill.amount ? bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
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
        refreshBills={handleRefresh} // Pass the refresh callback to the dialog
      />

      {/* Report Dialog */}
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </div>
  );
};

export default LongBillList;