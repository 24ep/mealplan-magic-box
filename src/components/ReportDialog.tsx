import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportUrl: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  reportUrl 
}) => {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] h-[90%] ">

      <iframe title="LongBill" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiNGRjMTUwNDEtZjAxOS00MmY2LWFiNTEtMWE3OTJkMTk3NmZlIiwidCI6ImE0ZTY5NmQ4LTg4OTktNGNhNy1iN2VhLTNiZjY0ODNjYzkwZCIsImMiOjEwfQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
  
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;