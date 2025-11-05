import React, { useState } from "react";
import DataTable from "./components/DataTable";
import ImportExport from "./components/ImportExport";
import ManageColumnsModal from "./components/ManageColumnsModal";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md py-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
            Dynamic Data Table Manager
          </h1>
          <div className="flex flex-wrap gap-3">
            <ImportExport />
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition">
              Manage Columns
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
            <DataTable />
          </div>
        </div>
      </main>

      {open && <ManageColumnsModal open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}







