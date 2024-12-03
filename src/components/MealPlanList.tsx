import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadMealPlanDialog from "./UploadMealPlanDialog";
import DeleteMealPlanDialog from "./DeleteMealPlanDialog";
import MealPlanItemsDialog from "./MealPlanItemsDialog";
import { useToast } from "@/components/ui/use-toast";

// Define interfaces for type safety
interface PlanType {
  id: string;
  name: string; // Assuming the plan type has a 'name' property
}

interface MealPlan {
  id: string;
  meal_plan_name: string;
  file_name: string;
  create_at: string;
  long_bill_count?: number;
  bill_type?: string;
}

interface MealPlanListProps {
  onSelect: (id: string) => void;
}



const MealPlanList: React.FC<MealPlanListProps> = ({ onSelect }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MealPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dialogState, setDialogState] = useState({
    uploadOpen: false,
    deleteOpen: false,
    itemsOpen: false
  });
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<number>(1);
  const { toast } = useToast();

  // Fetch Plan Types
  useEffect(() => {
    const fetchPlanTypes = async () => {
      try {
         // Direct API calls during development; proxy in production
  const apiBaseUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL // Direct API during development
    : '/api'; // Proxy endpoint in production
        const response = await fetch(`${apiBaseUrl}/QueryBillType`);
        if (response.ok) {
          const data: PlanType[] = await response.json();
          setPlanTypes(data);
        } else {
          throw new Error("Failed to fetch plan types");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Could not load plan types",
          variant: "destructive"
        });
      }
    };

    fetchPlanTypes();
  }, [toast]);

  // Fetch Meal Plans with Plan Type
  const fetchMealPlans = async () => {
    try {
      const formData = new URLSearchParams();
    
      formData.append("bill_type", selectedPlanType);
      
       // Direct API calls during development; proxy in production
  const apiBaseUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL // Direct API during development
    : '/api'; // Proxy endpoint in production
      const response = await fetch(`${apiBaseUrl}/QueryMealPlanList`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      if (response.ok) {
        const data: MealPlan[] = await response.json();
        setMealPlans(data);
        setFilteredPlans(data);
        toast({ title: "Success", description: "Meal plans loaded successfully" });
      } else {
        throw new Error("Failed to fetch meal plans");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load meal plans",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    
    fetchMealPlans();
  }, [selectedPlanType, toast]);

  // Filter plans based on search and date
  useEffect(() => {
    filterPlans(searchTerm, startDate, endDate);
  }, [searchTerm, startDate, endDate, mealPlans]);

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => 
    setSearchTerm(e.target.value.toLowerCase());

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filterPlans = (term: string, start: string, end: string) => {
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

  const handleDialogToggle = (dialog: keyof typeof dialogState, value: boolean) => 
    setDialogState((prev) => ({ ...prev, [dialog]: value }));

    const handleUpload = async (newPlan: MealPlan) => {
      try {
        console.log("Uploading new plan:", newPlan);
        await fetchMealPlans(); // Re-fetch meal plans after upload
        console.log("Meal plans refreshed");
        handleDialogToggle("uploadOpen", false);
        toast({
          title: "Success",
          description: "Meal plan uploaded and list refreshed.",
        });
      } catch (error) {
        console.error("Error refreshing meal plans:", error);
        toast({
          title: "Error",
          description: "Failed to refresh meal plans after upload.",
          variant: "destructive",
        });
      }
    };
  

  const handleDelete = () => {
    const updatedPlans = mealPlans.filter((plan) => plan.id !== selectedPlan?.id);
    setMealPlans(updatedPlans);
    setFilteredPlans(updatedPlans);
    handleDialogToggle("deleteOpen", false);
    setSelectedPlan(null);
  };

  const handleShowMealPlanItems = async (plan: MealPlan) => {
    try {
      const formData = new URLSearchParams();
      formData.append("meal_plan_id", plan.id);
       // Direct API calls during development; proxy in production
  const apiBaseUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL // Direct API during development
    : '/api'; // Proxy endpoint in production
      const response = await fetch(`${apiBaseUrl}/QueryMealPlanItem`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (response.ok) {
        const data: any[] = await response.json();
        setPlanItems(data);
        setSelectedPlan(plan);
        handleDialogToggle("itemsOpen", true);
      } else {
        throw new Error("Failed to fetch meal plan items");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load meal plan items",
        variant: "destructive"
      });
    }
  };

  const handleSelectPlan = (planId: string) => {
    const selectedPlan = filteredPlans.find(plan => plan.id === planId);
    setSelectedPlan(selectedPlan); // Ensure selectedPlan is updated
    onSelect(planId); // Call the onSelect function if needed
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Select 
            value={selectedPlanType} 
            onValueChange={(value: string) => setSelectedPlanType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Plan Type" />
            </SelectTrigger>
            <SelectContent>
              {planTypes.map((type) => (
                <SelectItem key={type.id} value={type.id }>
                  {type.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleDialogToggle("uploadOpen", true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add Plan
          </Button>
        </div>
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
          {filteredPlans .map((plan) => (
            <div
              key={plan.id}
              className={`flex items-center justify-between p-3 border rounded-lg  hover:bg-gray-50 cursor-pointer ${selectedPlan?.id === plan.id ? 'border-2 border-blue-500' : 'border-gray-200'}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <div className="flex flex-col">
                <p className="font-semibold text-lg">File ID :  {plan.id} | {plan.meal_plan_name}</p>
                <p className="text-sm text-gray-500">File Name: {plan.file_name}</p>
                <p className="text-sm text-gray-500">Created At: {plan.create_at}</p>
                <div className="mt-2 flex items-center">
                  <span className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded-full">
                    {plan.type_lable ? plan.type_lable : "No Type"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleShowMealPlanItems(plan); onSelect(plan.id) }}>
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
      <UploadMealPlanDialog 
        open={dialogState.uploadOpen} 
        onOpenChange={() => handleDialogToggle("uploadOpen", false)} 
        onUpload={handleUpload} 
        planTypes={planTypes} // Pass planTypes to the dialog
        selectedPlanType={selectedPlanType}
      />
      <DeleteMealPlanDialog 
        open={dialogState.deleteOpen} 
        onOpenChange={() => handleDialogToggle("deleteOpen", false)} 
        onDeleteSuccess={fetchMealPlans} // Pass the fetchMealPlans function
        planName={selectedPlan?.meal_plan_name} 
        planID={selectedPlan?.id} 
      />
      <MealPlanItemsDialog 
        open={dialogState.itemsOpen} 
        onOpenChange={() => handleDialogToggle("itemsOpen", false)} 
        items={planItems} 
        planName={selectedPlan?.meal_plan_name || ""} 
        planId={selectedPlan?.id || ""} 
        planFileName={selectedPlan?.file_name || ""} 
        onLongBillGenerated={() => { // Call onSelect only after a successful long bill generation
          toast({ title: "Long Bill Generated", description: "The long bill was created successfully." });
          handleSelectPlan(0); // Select default plan
          setTimeout(() => {
           
            handleSelectPlan(selectedPlan?.id); // Select the desired plan
          }, 500); // 1000 milliseconds = 1 second
        }} 
      />
    </div>
  );
};

export default MealPlanList;