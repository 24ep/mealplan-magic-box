import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface DeleteMealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName?: string;
  planID: string;
  onDeleteSuccess: () => void; // Added this line
}

const DeleteMealPlanDialog = ({
  open,
  onOpenChange,
  planName,
  planID,
  onDeleteSuccess, // Added this line
}: DeleteMealPlanDialogProps) => {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Get API base URL from environment variable

    try {
      const response = await fetch(`${apiBaseUrl}/DeletePlanFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planID }), // Send planID as JSON
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `"${planName}" has been deleted successfully.`,
        });
        onDeleteSuccess(); // Call the callback to refresh the list
        onOpenChange(false); // Close the dialog
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the meal plan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
 description: `Error deleting meal plan: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{planName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMealPlanDialog;