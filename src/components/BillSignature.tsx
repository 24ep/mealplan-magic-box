interface BillSignatureProps {
    billData: BillData;
    isEditMode: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  }
  
  export const BillSignature: React.FC<BillSignatureProps> = ({
    billData,
    isEditMode,
    handleInputChange,
  }) => (
    <table className="table-auto   border-l-0 border-r-0  border-b-0   border border-black w-full text-sm">
      <thead>
        <tr>
          <th className="border border-l-0  border-t-0 border-black px-4 py-2 text-left font-normal">Received By :</th>
          <th className="border border-t-0 border-black px-4 py-2 text-left font-normal">Full Name :</th>
          <th className="border border-r-0  border-t-0 border-black px-4 py-2 text-left font-normal">Signature :</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border  border-b-0 border-l-0  border-black px-4 py-6 text-left">
            {isEditMode ? (
              <input
                type="text"
                value={billData.receiver}
                onChange={(e) => handleInputChange(e, "receiver")}
                className="w-full p-1"
              />
            ) : (
              billData.receiver || "ผู้รับบริการ"
            )}
          </td>
          <td className="border  border-b-0 border-black px-4 py-6 text-left">
            {isEditMode ? (
              <input
                type="text"
                value={billData.receiver_full_name}
                onChange={(e) => handleInputChange(e, "receiver_full_name")}
                className="w-full p-1"
              />
            ) : (
              billData.receiver_full_name || "ชื่อผู้รับบริการ"
            )}
          </td>
          <td className="border  border-b-0  border-r-0 border-black px-4 py-6 text-left">
            {isEditMode ? (
              <input
                type="text"
                value={billData.signature}
                onChange={(e) => handleInputChange(e, "signature")}
                className="w-full p-1 "
              />
            ) : (
              billData.signature || "ลายเซ็น"
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );