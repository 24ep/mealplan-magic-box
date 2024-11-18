import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { MealPlan } from "@/pages/Index";
import { useToast } from "@/components/ui/use-toast";


interface PlanType {
  id: string;
  type: string;
}
interface UploadMealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (plan: MealPlan) => void;
  planTypes: PlanType[]; // Add planTypes prop
  selectedPlanType: string; // New prop for the selected plan type
}



const UploadMealPlanDialog = ({
  open,
  onOpenChange,
  onUpload,
  selectedPlanType, // Destructure selectedPlanType
}: UploadMealPlanDialogProps) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [planTypes, setPlanTypes] = useState<PlanType[]>([]);
  const [selectedPlanLabel, setSelectedPlanLabel] = useState<string>("");
  const { toast } = useToast();

  
  useEffect(() => {
    // Fetch plan types from the API
    const fetchPlanTypes = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/QueryBillType`);
        if (!response.ok) throw new Error("Failed to fetch plan types");
        const data: PlanType[] = await response.json();
        setPlanTypes(data);

        // Set the selected plan label based on the selectedPlanType ID
        const selectedPlan = data.find((type) => type.id === selectedPlanType);
        if (selectedPlan) {
          setSelectedPlanLabel(selectedPlan.type);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Could not load plan types",
          variant: "destructive",
        });
      }
    };

    fetchPlanTypes();
  }, [selectedPlanType, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file || !selectedPlanType) return; // Check for selected plan type

    try {
      const base64File = await fileToBase64(file);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const uploadEndpoint =
      selectedPlanType === 2
        ? `${apiBaseUrl}/UploadServiceBoothPlan`
        : `${apiBaseUrl}/UploadMealPlanFile`;

      console.log(selectedPlanType)

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PlanFile: base64File,
          FileName: file.name,
          PlanName: name,
          BillType: selectedPlanType, // Include the selected plan type
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const newPlan: MealPlan = {
          id: Math.random().toString(36).substr(2, 9),
          meal_plan_name: name,
          file_name: file.name,
          create_at: new Date().toISOString(),
        };
        onUpload(newPlan);
        toast({
          title: "Success",
          description: result.message || "Meal plan uploaded successfully.",
        });
        setName("");
        setFile(null);
        onOpenChange(false);
      } else {
        console.error("API Error:", result);
        toast({
          title: "Error",
          description: result.message || "Failed to upload meal plan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: `File upload failed: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Meal Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter plan name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planType">Selected Plan Type</Label>
            <Input
              id="planType"
              value={selectedPlanLabel }
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !file || !selectedPlanType}>
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMealPlanDialog;