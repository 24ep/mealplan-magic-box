import { useState } from "react";
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

interface UploadMealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (plan: MealPlan) => void;
}

const UploadMealPlanDialog = ({
  open,
  onOpenChange,
  onUpload,
}: UploadMealPlanDialogProps) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

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
    if (!name || !file) return;

    try {
        // Convert file to base64
        const base64File = await fileToBase64(file);

        // Make API request with MealPlan name, FileName, and MealPlanFile
        const response = await fetch("http://10.0.10.46/api/r/v1/UploadMealPlanFile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                MealPlanFile: base64File,
                FileName: file.name,   // Send the original file name
                PlanName: name,        // Send the meal plan name
            }),
        });

        const result = await response.json();
        // console.log("API Response:", result); // Log the full response for verification

        // Check for success based on `status` in response JSON
        if (result.status === "success") {
            const newPlan: MealPlan = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                date: new Date().toISOString().split("T")[0],
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
            // Log error if the status is anything other than "success"
            console.error("API Error:", result);
            toast({
                title: "Error",
                description: result.message || "Failed to upload meal plan.",
                variant: "destructive",
            });
        }
    } catch (error) {
        // Catch any network or unexpected errors
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
      <DialogContent className=" w-[550px] ">
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
            <Button type="submit" disabled={!name || !file}>
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMealPlanDialog;
