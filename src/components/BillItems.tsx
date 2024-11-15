import React from "react";

interface BillItem {
  item_description: string;
  quantity: number;
  price: number;
  status: string; // Added status property
}

interface BillItemsProps {
  items: BillItem[];
  isEditMode: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string, index: number) => void;
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
  handleCancelDelete: (index: number) => void; // Added cancel delete handler
}

const TextDisplay: React.FC<{ value: string | number; className?: string }> = ({
  value,
  className = "",
}) => <div className={`p-1 min-h-[2rem] ${className}`}>{value || ""}</div>;

export const BillItems: React.FC<BillItemsProps> = ({
  items = [],
  isEditMode,
  handleInputChange,
  handleAddItem,
  handleRemoveItem,
  handleCancelDelete,
}) => {
  // Filter out items with status "delete" if not in edit mode
  const visibleItems = isEditMode
    ? items
    : items.filter((item) => item.status !== "delete");

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="border border-t-0 border-l-0 border-black p-1 text-red-600 font-normal">
              <div>ลำดับที่</div>
              <div>Item</div>
            </th>
            <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
              <div>รายการ</div>
              <div>Description</div>
            </th>
            <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
              <div>จำนวน</div>
              <div>Quantity</div>
            </th>
            <th className="border border-t-0 border-black p-2 text-red-600 font-normal">
              <div>ราคาต่อหน่วย</div>
              <div>Unit Price</div>
            </th>
            <th className="border border-t-0 border-r-0 border-black p-2 text-red-600 font-normal">
              <div>จำนวนเงิน</div>
              <div>Amount</div>
            </th>
            {isEditMode && (
              <th className="border border-t-0 border-r-0 border-black p-2 text-red-600 font-normal">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item, index) => (
            <tr
              key={index}
              className={item.status === "delete" ? "bg-red-200" : ""}
            >
              <td className="border border-l-0 border-black p-1 text-red-600 text-center">
                {index + 1}
              </td>
              <td className="border border-black p-1">
                {isEditMode ? (
                  <input
                    type="text"
                    name="item_description"
                    value={item.item_description || ""}
                    onChange={(e) => handleInputChange(e, "item_description", index)}
                    className="w-full p-1"
                  />
                ) : (
                  <TextDisplay value={item.item_description || ""} />
                )}
              </td>
              <td className="border border-black p-1">
                {isEditMode ? (
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity || 0}
                    onChange={(e) => handleInputChange(e, "quantity", index)}
                    className="w-full p-1 text-right"
                  />
                ) : (
                  <TextDisplay value={item.quantity} className="text-right" />
                )}
              </td>
              <td className="border border-black p-1">
                {isEditMode ? (
                  <input
                    type="number"
                    name="price"
                    value={item.price || 0}
                    onChange={(e) => handleInputChange(e, "price", index)}
                    className="w-full p-1 text-right"
                  />
                ) : (
                  <TextDisplay
                    value={item.price?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    className="text-right"
                  />
                )}
              </td>
              <td className="border border-black p-1 text-right">
                {((item.quantity || 0) * (item.price || 0)).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              {isEditMode && (
                <td className="border border-black p-1 text-center">
                  {item.status === "delete" ? (
                    <button
                      onClick={() => handleCancelDelete(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditMode && (
        <div className="mt-4">
          <button
            onClick={handleAddItem}
            className="bg-green-500 text-white px-4 py-2 rounded ml-3"
          >
            Add Item
          </button>
        </div>
      )}
    </div>
  );
};

export default BillItems;
