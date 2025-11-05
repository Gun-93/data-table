import React, { useRef } from "react";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { addRows } from "../features/tableSlice";
import { saveAs } from "file-saver";

export default function ImportExport() {
  const fileRef = useRef();
  const dispatch = useDispatch();
  const { rows, columns } = useSelector((s) => s.table);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        const headers = Object.keys(data[0] || {});

        const knownIds = columns.map((c) => c.id);
        const unknown = headers.filter((h) => !knownIds.includes(h));
        if (unknown.length) {
          alert(`Invalid columns found: ${unknown.join(", ")}`);
          return;
        }

        dispatch(addRows(data));
        alert("✅ CSV imported successfully!");
      },
      error: () => alert("❌ Invalid CSV file format!"),
    });

    fileRef.current.value = "";
  };

  const handleExport = () => {
    const visibleCols = columns.filter((c) => c.visible);
    const csv = Papa.unparse(
      rows.map((r) => {
        const obj = {};
        visibleCols.forEach((c) => (obj[c.id] = r[c.id]));
        return obj;
      })
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_export.csv");
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        accept=".csv"
        ref={fileRef}
        onChange={handleImport}
        className="hidden"/>
      <button
        onClick={() => fileRef.current.click()}
        className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-blue-50">
        Import CSV
      </button>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-blue-50">
        Export CSV
      </button>
    </div>
  );
}


