import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BillHeaderProps {
    billData: BillData;
    isEditMode: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    renderInputOrDisplay: (field: string, value: string | number) => React.ReactNode;
  }
  
  export const BillHeader: React.FC<BillHeaderProps> = ({
    billData,
    isEditMode,
    handleInputChange,
    renderInputOrDisplay,
  }) => (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-red-600 text-2xl font-bold"> {billData.bill_type === "bootservice" ? "Banquet - Booth Service" : "Banquet"}</DialogTitle>
        <p className="text-center text-red-600 ">บริษัท เอ็น.ซี.ซี. แมนเนจเม้นท์ แอนด์ ดิเวลลอปเม้นท์ จำกัด</p>
        <p className="text-center text-red-600  text-sm">60 ศูนย์การประชุมแห่งชาติสิริกิติ์ ถนนรัชดาภิเษก แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110</p>
        <p className="text-center text-red-600  text-sm">60 Queen Sirikit National Convention Center, Ratchadapisek Road,Khlong Toei Sub-District, Khlong Toei District,</p>
        <p className="text-center text-red-600  text-sm">Bangkok 10110, Thailand  TAX ID : 0105534007639  Head Office</p>
        <h2 className="text-center text-red-600  font-bold text-lg mt-4">ใบส่งสินค้า/บริการ <br /> DELIVERY ORDER</h2>
      </DialogHeader>
  
      <div className="border  border-b-0 border-black mt-4">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td colSpan="4" className="border border-t-0 border-l-0 border-black p-2 text-center">
                <div className="text-red-600">วันที่/Date</div>
                {renderInputOrDisplay("event_date", billData.event_date)}
              </td>
              <td colSpan="4" className="border border-t-0 border-black p-2 text-center">
                <div className="text-red-600">เลขที่งาน/ Event ID</div>
                {renderInputOrDisplay("event_id", billData.event_id)}
              </td>
              <td colSpan="4" className="border border-t-0 border-black p-2 text-center">
                <div className="text-red-600">สถานที่จัดงาน/Venue</div>
                {renderInputOrDisplay("venue", billData.venue)}
              </td>
              <td colSpan="4" className="border border-t-0 border-r-0 border-black p-2 text-center">
                <div className="text-red-600">เลขที่บิล/Bill No.</div>
                {renderInputOrDisplay("running_id", billData.running_id)}
              </td>
            </tr>
            <tr>
                  <td colSpan="1" className="border border-l-0 text-red-600 border-e-0 border-black p-2 text-center">ชื่องาน/Event Name</td>
                  <td colSpan="15" className="border border-r-0 border-s-0 border-black p-2">
                    {renderInputOrDisplay("event_name", billData.event_name)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="1" className="border border-l-0 text-red-600 border-e-0 border-black p-2 text-center">บริษัท/Company</td>
                  <td colSpan="13" className="border  border-s-0 border-black p-2">
                    {renderInputOrDisplay("company_name", billData.company_name)}
                  </td>
                  <td colSpan="1" className="border border-e-0 border-black p-2 text-center">พนักงาน/Waiter</td>
                  <td colSpan="1" className="border border-r-0 border-s-0 border-black p-2">
                    {renderInputOrDisplay("waiter", billData.waiter)}
                  </td>
                </tr>
          </tbody>
        </table>
      </div>
    </>
  );
  