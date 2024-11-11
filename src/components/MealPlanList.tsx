import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import UploadMealPlanDialog from "./UploadMealPlanDialog";
import DeleteMealPlanDialog from "./DeleteMealPlanDialog";
import { MealPlan } from "@/pages/Index";

interface MealPlanListProps {
  onSelect: (id: string) => void;
}

const MealPlanList = ({ onSelect }: MealPlanListProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const handleUpload = (newPlan: MealPlan) => {
    setMealPlans([...mealPlans, newPlan]);
    setUploadOpen(false);
  };

  const handleDelete = () => {
    if (selectedPlan) {
      setMealPlans(mealPlans.filter((plan) => plan.id !== selectedPlan.id));
      setDeleteOpen(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Meal Plans</h2>
        <Button onClick={() => setUploadOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(plan.id)}
            >
              <div>
                <h3 className="font-medium">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.date}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <UploadMealPlanDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
      
      <DeleteMealPlanDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        planName={selectedPlan?.name}
      />
    </div>
  );
};

export default MealPlanList;