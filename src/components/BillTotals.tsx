interface BillTotalsProps {
    totalAmount: number;
    vat: number;
    totalWithVat: number;
  }
  
  export const BillTotals: React.FC<BillTotalsProps> = ({ totalAmount, vat, totalWithVat }) => (
    <table className="w-full border-collapse mb-4">
      <tbody>
        {[
          { label: "Total Amount", value: totalAmount },
          { label: "Add : Value Added Tax (7%)", value: vat },
          { label: "Total Amount Including VAT", value: totalWithVat, isBold: true, isDoubleBorder: true },
        ].map(({ label, value, isBold, isDoubleBorder }) => (
          <tr key={label}>
            <td colSpan="4" className="border border-0 border-black p-2 text-right font-semibold">
              {label}
            </td>
            <td
              className={`border border-r-0 border-t-0 border-black p-2 text-right ${
                isBold ? "font-bold" : ""
              } ${isDoubleBorder ? "border-b-4 border-double" : ""}`}
            >
              {value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );