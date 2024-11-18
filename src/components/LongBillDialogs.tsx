import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Edit , Sheet } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@/components/ui/use-toast";
const LongBillDialog = ({ bill, open, onOpenChange }) => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [billData, setBillData] = useState({
    id: "",
    meal_plan_id:null,
    event_date: "",
    event_id: null,
    venue: "",
    event_name: "",
    company_name: "",
    waiter: null,
    status: null,
    receiver:"",
    receiver_full_name:"",
    signature:"",
    items: []
  });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bill) setBillData(prev => ({ ...prev, ...bill }));
  }, [bill]);

  useEffect(() => {
    if (open && bill?.id) fetchBillItems(bill.id);
  }, [open, bill]);

  const fetchBillItems = async (longbill_id) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/QueryLongBillItems`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ longbill_id })
      });
      const result = await response.json();
      if (result.status === "success") {
        const data = await response.json();
        setBillData(prev => ({ ...prev, items: data }));
      }
    } catch (error) {
      console.error("Error fetching bill items:", error);
    }
  };

  const handleSave = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/LongBillData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ LongBillData: billData }),
      });
  
      if (!response.ok) {
        // Handle network or HTTP errors (e.g., 500, 404)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.status === "success") {
        console.log("Bill saved successfully:", result);
        setIsEditMode(false); // Exit edit mode after saving
        toast({
          title: "Success",
          description: "Long bill saved successfully.",
          
        });
      } else {
        // Handle server-side failure (e.g., if result.status isn't success)
        console.error("Error saving bill:", result.message || "Unknown error");
        toast({
          title: "Error",
          description: result.message || "An error occurred while saving the bill.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        status: "error",  // Optional, to specify error type
      });
    }
  };
  
// In your JSX, update the onClick handler of the Save button
<Button
  variant="default"
  onClick={handleSave}
>
  Save
</Button>



  const handleInputChange = (e, field, index = null) => {
    const value = index !== null ? parseFloat(e.target.value) || e.target.value : e.target.value;
    if (index !== null) {
      setBillData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => (i === index ? { ...item, [e.target.name]: value } : item))
      }));
    } else {
      setBillData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const totalAmount = billData.items?.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0) || 0;
  const vat = totalAmount * 0.07;
  const totalWithVat = totalAmount + vat;

  const TextDisplay = ({ value, className = "" }) => <div className={`p-1 min-h-[2rem] ${className}`}>{value || ""}</div>;

  const renderInputOrDisplay = (field, value) =>
    isEditMode ? (
      <input type="text" value={value} onChange={(e) => handleInputChange(e, field)} className="w-full p-1" />
    ) : (
      <TextDisplay value={value} />
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[100%] max-w-[1100px] h-[90vh] p-0 shadow-lg rounded-lg overflow-y-auto flex">
        <div className="w-[70%] pr-4 p-6 ">
          <div  ref={contentRef} className=" p-6  ">
            <style>
              {`
                @media print {
                  .no-print {
                    display: none;
                  }
             
                }
              `}
            </style>
            <DialogHeader>
              <DialogTitle className="text-center text-red-600 text-2xl font-bold">Banquet</DialogTitle>
              <p className="text-center">บริษัท เอ็น.ซี.ซี. เมเนจเม้นท์ แอนด์ ดิเวลลอปเม้นท์ จำกัด</p>
              <p className="text-center text-sm">60 ศูนย์การประชุมแห่งชาติสิริกิติ์ ถนนรัชดาภิเษก กรุงเทพมหานคร 10110</p>
              <h2 className="text-center font-bold text-lg mt-4">ใบส่งสินค้า/บริการ <br /> DELIVERY ORDER</h2>
            </DialogHeader>

            <div className="border border-black mt-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td colSpan="4" className="border border-t-0 border-l-0 border-black p-2 text-center">
                    <div className="text-red-600">วันที่/Date</div>
                    {renderInputOrDisplay("event_date", billData.event_date)}
                  </td>
                  <td colSpan="4" className="border border-t-0 border-black p-2 text-center">
                    <div className="text-red-600">เลขที่งาน/ Event ID</div>
                    {renderInputOrDisplay("event_id", billData.event_id)}
                  </td>
                  <td colSpan="5" className="border  border-t-0 border-black p-2 text-center">
                    <div className="text-red-600">สถานที่จัดงาน/Venue</div>
                    {renderInputOrDisplay("venue", billData.venue)}
                  </td>
                  <td colSpan="3" className="border  border-t-0 border-r-0 border-black p-2 text-center">
                    <div className="text-red-600">เลขที่บิล/Bill No.</div>
                    {renderInputOrDisplay("id", billData.id)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="1" className="border border-l-0 text-red-600 border-e-0 border-black p-2 text-center">ชื่องาน/Event Name</td>
                  <td colSpan="15" className="border border-r-0 border-s-0 border-black p-2">
                    {renderInputOrDisplay("event_name", billData.event_name)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="1" className="border border-l-0 text-red-600 border-e-0 border-black p-2 text-center">บริษัท/Company</td>
                  <td colSpan="13" className="border  border-s-0 border-black p-2">
                    {renderInputOrDisplay("company_name", billData.company_name)}
                  </td>
                  <td colSpan="1" className="border border-e-0 border-black p-2 text-center">พนักงาน/Waiter</td>
                  <td colSpan="1" className="border border-r-0 border-s-0 border-black p-2">
                    {renderInputOrDisplay("waiter", billData.waiter)}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-collapse ">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border border-t-0 border-l-0 border-black p-1 text-red-600 font-normal">
                    <div>ลำดับที่</div>
                    <div>Item</div>
                  </th>
                  <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
                    <div>รายการ</div>
                    <div>Description</div>
                  </th>
                  <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
                    <div>จำนวน</div>
                    <div>Quantity</div>
                  </th>
                  <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
                    <div>ราคาต่อหน่วย</div>
                    <div>Unit Price</div>
                  </th>
                  <th className="border border-t-0 border-r-0 border-black p-2 text-red-600 font-normal">
                    <div>จำนวนเงิน</div>
                    <div>Amount</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {billData.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="border  border-l-0   border-black p-1 text-red-600 text-center">{index + 1}</td>
                    <td className="border  border-black p-1">
                      {isEditMode ? (
                        <input
                          type="text"
                          name="item_description"
                          value={item.item_description || ""}
                          onChange={(e) => handleInputChange(e, "items", index)}
                          className="w-full p-1"
                        />
                      ) : (
                        <TextDisplay value={item.item_description} />
                      )}
                    </td>
                    <td className="border border-black p-1">
                      {isEditMode ? (
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity || 0}
                          onChange={(e) => handleInputChange(e, "items", index)}
                          className="w-full p-1 text-right"
                        />
                      ) : (
                        <TextDisplay value={item.quantity} className="text-right" />
                      )}
                    </td>
                    <td className="border border-black p-1">
                      {isEditMode ? (
                        <input
                          type="number"
                          name="price"
                          value={item.price || 0}
                          onChange={(e) => handleInputChange(e, "items", index)}
                          className="w-full p-1 text-right"
                        />
                      ) : (
                        <TextDisplay
                          value={item.price?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                          className="text-right"
                        />
                      )}
                    </td>
                    <td className="border border-r-0  border-black p-1 text-right">
                      {(item.quantity * item.price || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border-collapse mb-4">
  <tbody>
    {[
      { label: "Total Amount", value: totalAmount },
      { label: "Add : Value Added Tax (7%)", value: vat },
      { label: "Total Amount Including VAT", value: totalWithVat, isBold: true, isDoubleBorder: true },
    ].map(({ label, value, isBold, isDoubleBorder }) => (
      <tr key={label}>
        <td colSpan="4" className="border border-0 border-black p-2 text-right font-semibold">
          {label}
        </td>
        <td
          className={`border border-r-0 border-t-0 border-black p-2 text-right ${
            isBold ? "font-bold" : ""
          } ${isDoubleBorder ? "border-b-4 border-double" : ""}`}
        >
          {value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    ))}
  </tbody>
</table>


</div>

  <table className="table-auto border-t-0 border-collapse border border-black w-full text-sm">
    <thead>
      <tr>
        <th className="border border-t-0 border-black px-4 py-2 text-left font-normal">Received By :</th>
        <th className="border border-t-0 border-black px-4 py-2 text-left font-normal">Full Name :</th>
        <th className="border border-t-0 border-black px-4 py-2 text-left font-normal">Signature :</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-black px-4 py-6 text-left">ผู้รับบริการ</td>
        <td className="border border-black px-4 py-6 text-left">ชื่อผู้รับบริการ</td>
        <td className="border border-black px-4 py-6 text-left">ลายเซ็น</td>
      </tr>
    </tbody>
  </table>


          </div>
        </div>
  

        <div className="w-[30%] bg-gray-100 p-6">
          <div className="flex flex-col items-start">
            <div className="mb-4">
              <p className="font-bold">Meal File ID: {billData.meal_plan_id || "N/A"}</p>
              <p className="font-bold">Billing ID: {billData.id}</p>
              <br/>
              <div className="px-4 py-3 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">Event Date</h3>
                <p className="mt-1 max-w-2xl text-gray-500"> {billData.event_date}</p>
              </div>
              <div className="px-4 py-3 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">Company</h3>
                <p className="mt-1 max-w-2xl  text-gray-500"> {billData.company_name}</p>
              </div>
              <div className="px-4 py-3 sm:px-0">
                <h3 className="text-base/7 font-semibold text-gray-900">Event</h3>
                <p className="mt-1 max-w-2xl text-gray-500"> ID {billData.event_id} {billData.event_name}</p>
              </div>
              <br/>
              
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)}>
                <Edit className="w-4 h-4 mr-2" /> {isEditMode ? "View Mode" : "Edit Mode"}
              </Button>
              <Button variant="outline" size="sm" onClick={() =>handlePrint()}>
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" >
                <Sheet className="w-4 h-4 mr-2" /> Export to excel
              </Button>

              {isEditMode && (
                <div className="flex flex-col justify-end mt-4 gap-2 w-full">
                  <span>Edit</span>
                  <Button
                    variant="default"
                    onClick={() => {
                      handleSave();
                      setIsEditMode(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LongBillDialog;