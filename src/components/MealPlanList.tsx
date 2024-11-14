import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Eye } from "lucide-react";
import UploadMealPlanDialog from "./UploadMealPlanDialog";
import DeleteMealPlanDialog from "./DeleteMealPlanDialog";
import MealPlanItemsDialog from "./MealPlanItemsDialog";
import { MealPlan } from "@/pages/Index";
import { useToast } from "@/components/ui/use-toast";

const MealPlanList = ({ onSelect }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dialogState, setDialogState] = useState({ uploadOpen: false, deleteOpen: false, itemsOpen: false });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planItems, setPlanItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await fetch("http://10.0.10.46/api/r/v1/QueryMealPlanList");
        if (response.ok) {
          const data = await response.json();
          setMealPlans(data);
          setFilteredPlans(data); // Initialize filtered plans
          toast({ title: "Success", description: "Meal plans loaded successfully" });
        } else {
          throw new Error("Failed to fetch meal plans");
        }
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    };

    fetchMealPlans();
  }, [toast]);

  useEffect(() => {
    filterPlans(searchTerm, startDate, endDate);
  }, [searchTerm, startDate, endDate, mealPlans]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filterPlans = (term, start, end) => {
    const startTime = start ? new Date(start) : null;
    const endTime = end ? new Date(end) : null;

    const filtered = mealPlans.filter((plan) => {
      const matchesSearch = [plan.meal_plan_name, plan.file_name, String(plan.id)]
        .some((field) => field?.toLowerCase().includes(term));
      const planDate = new Date(plan.create_at);
      const inDateRange = (!startTime || planDate >= startTime) && (!endTime || planDate <= endTime);

      return matchesSearch && inDateRange;
    });

    setFilteredPlans(filtered);
  };

  const handleDialogToggle = (dialog, value) => setDialogState((prev) => ({ ...prev, [dialog]: value }));

  const handleUpload = (newPlan) => {
    const updatedPlans = [...mealPlans, newPlan];
    setMealPlans(updatedPlans);
    setFilteredPlans(updatedPlans);
    handleDialogToggle("uploadOpen", false);
  };

  const handleDelete = () => {
    const updatedPlans = mealPlans.filter((plan) => plan.id !== selectedPlan?.id);
    setMealPlans(updatedPlans);
    setFilteredPlans(updatedPlans);
    handleDialogToggle("deleteOpen", false);
    setSelectedPlan(null);
  };

  const handleShowMealPlanItems = async (plan) => {
    try {
      const formData = new URLSearchParams();
      formData.append("meal_plan_id", plan.id);

      const response = await fetch("http://10.0.10.46/api/r/v1/QueryMealPlanItem", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPlanItems(data);
        setSelectedPlan(plan);
        handleDialogToggle("itemsOpen", true);
        // toast({ title: "Meal Plan Items", description: `Found ${data.length} items` });
      } else {
        throw new Error("Failed to fetch meal plan items");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Meal Plans</h2>
        <Button onClick={() => handleDialogToggle("uploadOpen", true)} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Plan
        </Button>
      </div>

      {/* Search and Date Filter */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search by meal plan name, file name, or ID"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-1 text-sm border rounded"
        />
        <div className="flex space-x-1 w-full">
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
            className="p-1 text-sm border rounded w-[50%]"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
            className="p-1 text-sm border rounded w-[50%]"
          />
        </div>
      </div>

      {/* Filtered Meal Plans */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(plan.id)}
            >
              <div className="flex flex-col">
                <p className="font-semibold text-lg">MP-{plan.id}  {plan.meal_plan_name}</p>
                <p className="text-sm text-gray-500">File Name: {plan.file_name}</p>
                <p className="text-sm text-gray-500">Created At: {plan.create_at}</p>
                <p className="text-sm text-gray-600">Long Bills: {plan.long_bill_count || 0}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleShowMealPlanItems(plan); }}>
                  <Eye className="w-4 h-4 text-blue-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); handleDialogToggle("deleteOpen", true); }}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Dialog Components */}
      <UploadMealPlanDialog open={dialogState.uploadOpen} onOpenChange={() => handleDialogToggle("uploadOpen", false)} onUpload={handleUpload} />
      <DeleteMealPlanDialog open={dialogState.deleteOpen} onOpenChange={() => handleDialogToggle("deleteOpen", false)} onConfirm={handleDelete} planName={selectedPlan?.meal_plan_name} />
      <MealPlanItemsDialog 
      open={dialogState.itemsOpen} 
      onOpenChange={() => handleDialogToggle("itemsOpen", false)} 
      items={planItems} 
      planName={selectedPlan?.meal_plan_name || ""} 
      planId={selectedPlan?.id || ""} 
      planFileName={selectedPlan?.file_name || ""} 
      onLongBillGenerated={() => toast({ title: "Long Bill Generated", description: "The long bill was created successfully." })} />
    </div>
  );
};

export default MealPlanList;
