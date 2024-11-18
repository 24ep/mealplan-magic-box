import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@/components/ui/use-toast";
import { BillHeader } from "@/components/BillHeader";
import { BillItems } from "@/components/BillItems";
import { BillSidebar } from "@/components/BillSidebar";
import { BillFooter } from "@/components/BillFooter";

export interface BillItem {
  id?: string;
  item_description: string;
  quantity: number;
  price: number;
}

export interface BillData {
  id: string;
  meal_plan_id: number | null;
  event_date: string;
  event_id: number | null;
  venue: string;
  event_name: string;
  company_name: string;
  waiter: string | null;
  status: string | null;
  receiver: string;
  receiver_full_name: string;
  signature: string;
  items: BillItem[];
}

const LongBillDialog = ({ bill, open, onOpenChange,refreshBills  }) => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [billData, setBillData] = useState<BillData>({
    id: "",
    meal_plan_id: null,
    event_date: "",
    event_id: null,
    venue: "",
    event_name: "",
    company_name: "",
    waiter: null,
    status: null,
    receiver: "",
    receiver_full_name: "",
    signature: "",
    items: []
  });
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bill) setBillData((prev) => ({ ...prev, ...bill }));
  }, [bill]);

  useEffect(() => {
    if (open && bill?.id) fetchBillItems(bill.id);
  }, [open, bill]);

    


  useEffect(() => {
    // Check if the billData.status has been updated and call handleSave
    if (billData.status) {
      console.log("Status updated, calling handleSave with new data:", billData);
      handleSave(); // Trigger save when status is updated
    }
  }, [billData.status]); // This effect will run whenever `billData.status` changes
  

  const fetchBillItems = async (longbill_id) => {
    setLoading(true);
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/QueryLongBillItems`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ longbill_id }),
      });
      if (response.ok) {
        const data = await response.json();
        const sanitizedData = data.map((item) => ({
          id: item.id || "",
          item_description: item.item_description || "",
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
        }));
        setBillData((prev) => ({ ...prev, items: sanitizedData}));
      }
    } catch (error) {
      console.error("Error fetching bill items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bill items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {

      const updatedBillData = { ...billData }; // Create a fresh copy
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/LongBillData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ LongBillData: updatedBillData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        setIsEditMode(false);
        toast({
          title: "Success",
          description: "Long bill saved successfully.",
        });
        refreshBills(); // Refresh the list after saving
        // onOpenChange(false); // Close the dialog
      } else {
        toast({
          title: "Failure",
          description: result.message,
        });
        throw new Error(result.message || "Failed to save bill");
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      toast({
        title: "Error",
        description: `Failed to save bill: ${error.message}`,
        variant: "destructive",
      });
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    index: number | null = null
  ) => {
    const value = e.target.value || "";
    if (index !== null) {
      setBillData((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, [e.target.name]: value  } : item 
        ),
      }));
    } else {
      setBillData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddItem = () => {
    setBillData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: `temp-${Date.now()}`, item_description: "", quantity: 0, price: 0 , status :"new"},
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const itemToRemove = billData.items[index];
    
    if (itemToRemove && typeof itemToRemove.id === "string" && itemToRemove.id.startsWith("temp-")) {
      setBillData((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, status: "delete" } : item
        ),
      }));


    } else {
      // For existing items, mark them as "delete"
      setBillData((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, status: "delete" } : item
        ),
      }));
    } 
    console.log(billData);
  };
  const handleCancelDelete = (index: number) => {
    setBillData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, status: "new" } : item
      ),
    }));
  };

  const handlePrint = useReactToPrint({ contentRef });

  const totalAmount = React.useMemo(
    () => billData.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [billData.items]
  );
  const vat = React.useMemo(() => totalAmount * 0.07, [totalAmount]);
  const totalWithVat = React.useMemo(() => totalAmount + vat, [totalAmount, vat]);

  const TextDisplay = ({ value, className = "" }) => (
    <div className={`w-full p-1 min-h-[2rem] ${className}`}>{value || ""}</div>
  );

  const renderInputOrDisplay = (field: string, value: string | number) => {
    if (field === "id") {
      return <TextDisplay value={`${value}`} className="font-normal" />;
    }

    return isEditMode ? (
      <input
        type={
          field === "event_date"
            ? "date"
            : field === "event_id"
            ? "number"
            : "text"
        }
        value={field === "event_date" ? (value as string).slice(0, 10) : value || ""}
        onChange={(e) => handleInputChange(e, field)}
        className="w-full p-2 bg-gray-200"
      />
    ) : (
      <TextDisplay value={value} />
    );
  };
  // const visibleItems = billData.items.filter((item) => item.status !== "delete");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100%] max-w-[1100px] h-[90vh] p-0 shadow-lg rounded-lg overflow-y-auto flex">
        <div className="w-[70%] pr-4 p-6">
          <div ref={contentRef} className="p-6">
            <BillHeader
              billData={billData}
              isEditMode={isEditMode}
              handleInputChange={handleInputChange}
              renderInputOrDisplay={renderInputOrDisplay}
            />
            <div className="border border-t-0 border-black">
   
              <BillItems
                items={billData.items}
                isEditMode={isEditMode}
                handleInputChange={handleInputChange}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
                handleCancelDelete={handleCancelDelete}
              />
              <BillFooter
                billData={billData}
                isEditMode={isEditMode}
                handleInputChange={handleInputChange}
                totalAmount={totalAmount}
                vat={vat}
                totalWithVat={totalWithVat}
              />
            </div>
          </div>
        </div>
        <BillSidebar
          billData={billData}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          handleSave={handleSave}
          handlePrint={handlePrint}
          setBillData={setBillData}

        />
      </DialogContent>
    </Dialog>
  );
};

export default LongBillDialog;
