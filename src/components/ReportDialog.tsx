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

    
                <iframe
                src="http://10.0.10.55:3000/public/dashboard/9e44d4d6-6ab9-4cad-abe4-b63c55b4fc95"
                frameborder="0"
                width="100%"
                height="100%"
                allowtransparency
            ></iframe>
  
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;