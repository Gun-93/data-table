import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addColumn, toggleColumn } from "../features/tableSlice";

export default function ManageColumnsModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { columns } = useSelector((s) => s.table);

  const [newCol, setNewCol] = useState("");

  const handleAdd = () => {
    const id = newCol.trim().toLowerCase().replace(/\s+/g, "_");
    if (!id) return alert("Enter a valid column name!");
    if (columns.some((c) => c.id === id)) return alert("Column already exists!");
    dispatch(addColumn({ id, label: newCol }));
    setNewCol("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Manage Columns</h2>

        <div className="space-y-2 max-h-64 overflow-y-auto border-b pb-3">
          {columns.map((col) => (
            <label
              key={col.id}
              className="flex items-center justify-between cursor-pointer">
              <span className="capitalize">{col.label}</span>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => dispatch(toggleColumn(col.id))}
                className="w-4 h-4 accent-blue-600"/>
            </label>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add new column (e.g. Department)"
            value={newCol}
            onChange={(e) => setNewCol(e.target.value)}
            className="flex-grow border rounded-lg px-3 py-2"/>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


