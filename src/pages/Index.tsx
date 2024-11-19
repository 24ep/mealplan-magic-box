import { useState } from "react";
import MealPlanList from "@/components/MealPlanList";
import LongBillList from "@/components/LongBillList";
import { useToast } from "@/components/ui/use-toast";

export type MealPlan = {
  id: string;
  name: string;
  date: string;
};

export type LongBill = {
  id: string;
  company_name: string;
  amount: number;
  event_id: number;
  event_date: string;
  waiter: number;
  receiver: string;
  receiver_full_name: string;
  signature:string;
  venue:string;
  event_name:string;
  status:number;
  meal_plan_id:number;
};


const Index = () => {
  const [selectedMealPlan, setSelectedMealPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMealPlanSelect = (id: string) => {
    setSelectedMealPlan(id);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-[30%] border-r border-gray-200 bg-white p-4">
        <MealPlanList onSelect={handleMealPlanSelect} />
      </div>
      <div className="w-[70%] p-4">
        <LongBillList selectedMealPlanId={selectedMealPlan} />
      </div>
    </div>
  );
};

export default Index;