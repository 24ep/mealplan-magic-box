// BillSidebar.tsx
import { Button } from "@/components/ui/button";
import { Printer, Edit, Sheet } from "lucide-react";
import { useState, useEffect } from "react";

interface BillData {
  meal_plan_id?: string;
  id: string;
  event_date: string;
  company_name: string;
  event_id: string;
  event_name: string;
  status: string;
  running_id:number;
}

interface BillSidebarProps {
  billData: BillData;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  handleSave: (updatedBillData: BillData) => void;
  handlePrint: () => void;
  setBillData: (updatedData: BillData) => void;
}

export const BillSidebar: React.FC<BillSidebarProps> = ({
  billData,
  isEditMode,
  setIsEditMode,
  handleSave,
  handlePrint,
  setBillData,
}) => {
  const [status, setStatus] = useState(billData.status);

  useEffect(() => {
    setStatus(billData.status);
  }, [billData.status]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setBillData({ ...billData, status: newStatus });
  };

  const saveChanges = () => {
    const updatedBillData = { ...billData, status };
    handleSave(updatedBillData);
    setIsEditMode(false);
  };

  return (
    <div className="w-[30%] bg-gray-100 p-6">
      <div className="flex flex-col items-start">
        <div className="mb-4">
          <p className="font-bold">Meal File ID: {billData.meal_plan_id || "N/A"}</p>
          <p className="font-bold">Billing ID: {billData.running_id}</p>
          <p className="font-bold">Record ID: {billData.id}</p>
          <p className="font-bold">Type: {billData.bill_type}</p>
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
          <div className="px-4 py-3 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">Status</h3>
            <select
              value={status}
              onChange={handleSelectChange}
              className={`mt-1 max-w-2xl border rounded-md px-2 py-1 ${
                status === "2"
                  ? "text-red-600 border-red-600 bg-red-50"
                  : "text-gray-900 border-gray-300"
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
              <Button variant="default" onClick={saveChanges}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};