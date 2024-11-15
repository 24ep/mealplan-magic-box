import { Button } from "@/components/ui/button";
import { Printer, Edit, Sheet } from "lucide-react";
import { useState } from "react";

interface BillSidebarProps {
  billData: BillData;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  handleSave: () => void;
  handlePrint: () => void;
  handleStatusChange: (newStatus: string) => void;
}

export const BillSidebar: React.FC<BillSidebarProps> = ({
  billData,
  isEditMode,
  setIsEditMode,
  handleSave,
  handlePrint,
  handleStatusChange,
}) => {
  const [status, setStatus] = useState(billData.status || "1");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    console.log("New Status Selected:", newStatus); // Debug log
    setStatus(newStatus);
    handleStatusChange(newStatus); // Inform the parent
    handleSave(); // Optional save trigger
  };

  return (
    <div className="w-[30%] bg-gray-100 p-6">
      <div className="flex flex-col items-start">
        <div className="mb-4">
          <p className="font-bold">Meal File ID: {billData.meal_plan_id || "N/A"}</p>
          <p className="font-bold">Billing ID: {billData.id}</p>
          <br />
          <div className="px-4 py-3 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">Event Date</h3>
            <p className="mt-1 max-w-2xl text-gray-500">{billData.event_date}</p>
          </div>
          <div className="px-4 py-3 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">Company</h3>
            <p className="mt-1 max-w-2xl text-gray-500">{billData.company_name}</p>
          </div>
          <div className="px-4 py-3 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">Event</h3>
            <p className="mt-1 max-w-2xl text-gray-500">
              ID {billData.event_id} {billData.event_name}
            </p>
          </div>
          <br />
          <div className="px-4 py-3 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">Status</h3>
            <select
              value={status} // Use the local state
              onChange={handleSelectChange} // Update local and parent state
              className={`mt-1 max-w-2xl border rounded-md px-2 py-1 ${
                status === "2" ? "text-red-600 border-red-600 bg-red-50" : "text-gray-900 border-gray-300"
              }`}
            >
              <option value="1">New</option>
              <option value="2">Cancelled</option>
            </select>


          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Edit className="w-4 h-4 mr-2" /> {isEditMode ? "View Mode" : "Edit Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Sheet className="w-4 h-4 mr-2" /> Export to Excel
          </Button>

          {isEditMode && (
            <div className="flex flex-col justify-end mt-4 gap-2 w-full">
              <span>Edit</span>
              <Button variant="default" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
