
import { BillTotals  } from "@/components/BillTotals";
import { BillSignature  } from "@/components/BillSignature";
interface BillFooterProps {
    billData: BillData;
    isEditMode: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  }
  
  export const BillFooter: React.FC<BillFooterProps> = ({
    billData,
    isEditMode,
    handleInputChange,
  }) => {
    const totalAmount = billData.items?.reduce((sum, item) => 
      sum + ((item.quantity || 0) * (item.price || 0)), 0) || 0;
    const vat = totalAmount * 0.07;
    const totalWithVat = totalAmount + vat;
  
    return (
      <div className="mt-0">
        <BillTotals
          totalAmount={totalAmount}
          vat={vat}
          totalWithVat={totalWithVat}
        />
        <BillSignature
          billData={billData}
          isEditMode={isEditMode}
          handleInputChange={handleInputChange}
        />
      </div>
    );
  };
  