import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface MealPlanItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  event_date: string;
  descriptive_of_event: string;
  receiver_full_name: string;
  event_id: number;
  item_description: string;
  price: number;
  meal_plan_id: string;
  event_name: string;
  company_name: string;
  waiter: number;
  receiver: string; 
  signature: string; 
}

interface MealPlanItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MealPlanItem[];
  planName: string;
  planId: number;
  planFileName: string;
  onLongBillGenerated?: () => void;
}

const MealPlanItemsDialog = ({
  open,
  onOpenChange,
  items,
  planName,
  planId,
  planFileName,
  onLongBillGenerated = () => {},
}: MealPlanItemsDialogProps) => {
  const [editedItems, setEditedItems] = useState<MealPlanItem[]>(items);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => setEditedItems(items), [items]);

  const totalPrice = editedItems.reduce((sum, item) => sum + item.price, 0);

  const handleEditChange = (index: number, field: string, value: any) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const handleSelectChange = (id: string) => {
    const newSelected = new Set(selectedItems);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const handleSelectAllChange = (groupItems: MealPlanItem[], isChecked: boolean) => {
    const newSelected = new Set(selectedItems);
    groupItems.forEach((item) => {
      if (isChecked) {
        newSelected.add(item.id);
      } else {
        newSelected.delete(item.id);
      }
    });
    setSelectedItems(newSelected);
  };

  const handleSelectAllTables = (isChecked: boolean) => {
    const newSelected = new Set(selectedItems);
    editedItems.forEach((item) => {
      if (isChecked) {
        newSelected.add(item.id);
      } else {
        newSelected.delete(item.id);
      }
    });
    setSelectedItems(newSelected);
  };

  const handleGenerateLongBill = async () => {
    const selectedData = editedItems.filter((item) =>
      selectedItems.has(item.id)
    );
  
    try {
      const response = await fetch(
        "http://10.0.10.46/api/r/v1/GenerateLongBillFromJson",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MealPlanItem: selectedData  }),
        }
      );
  
      // Parse the JSON response once
      const result = await response.json();
  
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Long bill generated successfully.",
        });
        onLongBillGenerated();
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: `Failed to create long bill: ${
            result.message || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  

  // Group items by event_date and event_id
  const groupedItems = editedItems.reduce((groups, item) => {
    const key = `${item.event_date}_${item.event_id}_${item.event_name}_${item.company_name}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, MealPlanItem[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-[5%] max-w-[90%] w-full h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Items in MP-{planId} {planName}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-gray-100 rounded mb-4">
          <p>
            <strong>File :</strong> {planFileName}
          </p>
          <p>
            <strong>Total Items:</strong> {editedItems.length}
          </p>
          <p>
            <strong>Total Price:</strong> {totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <Button variant="outline" className="sm hover:bg-blue-400 hover:text-white"
            onClick={() => handleSelectAllTables(true)}
          >
            Select All
          </Button>
          <Button variant="outline" className="sm ml-2 hover:bg-red-400 hover:text-white"
            onClick={() => handleSelectAllTables(false)}
          >
            Deselect All
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {Object.entries(groupedItems).map(([groupKey, itemsInGroup]) => {
            const [event_date, event_id, event_name, company_name] = groupKey.split("_");
            const allSelected = itemsInGroup.every((item) => selectedItems.has(item.id));
            const someSelected = itemsInGroup.some((item) => selectedItems.has(item.id));

            return (
              <div key={groupKey} className="mb-4">
                <span className="font-semibold text-gray-900">
                  {event_date} | Event ID: {event_id} {event_name} | {company_name}
                </span>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          // indeterminate={!allSelected && someSelected}
                          onChange={(e) =>
                            handleSelectAllChange(itemsInGroup, e.target.checked)
                          }
                        />
                      </TableHead>
                      {[
                        "event_date",
                        "descriptive_of_event",
                        "item_description",
                        "price",
                        "unit",
                        "event_id",
                        "event_name",
                        "company_name",
                        "receiver",
                        "receiver_full_name",
                        "signature",
                        "waiter",
                      ].map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
  {itemsInGroup.map((item, index) => (
    <TableRow key={item.id}>
      <TableCell>
        <input
          type="checkbox"
          checked={selectedItems.has(item.id)}
          onChange={() => handleSelectChange(item.id)}
        />
      </TableCell>
      {[
        "event_date",
        "descriptive_of_event",
        "item_description",
        "price",
        "unit",
        "event_id",
        "event_name",
        "company_name",
        "receiver",
        "receiver_full_name",
        "signature",
        "waiter",
      ].map((field) => {
        // Dynamically determine the field type
        const fieldType = typeof item[field as keyof MealPlanItem];

        // Set input type based on field's data type
        const inputType = 
        field === "price" || 
        field === "waiter" ||
        field === "event_id" ||
        fieldType === "number" ? "number" : "text";

        return (
          <TableCell key={field}>
            <input
              type={inputType}
              value={item[field as keyof MealPlanItem]}
              onChange={(e) =>
                handleEditChange(
                  index,
                  field,
                  field === "price"
                    ? parseFloat(e.target.value)
                    : e.target.value
                )
              }
            />
          </TableCell>
        );
      })}
    </TableRow>
  ))}
</TableBody>


                </Table>
              </div>
            );
          })}
        </div>
        <div className="mt-auto flex justify-end gap-2 p-4 border-t">
          <Button
            className={`${
              selectedItems.size > 0
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleGenerateLongBill}
            disabled={selectedItems.size === 0}
          >
            Generate {selectedItems.size} items
            {selectedItems.size !== 1 ? "s" : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanItemsDialog;
