import { createSlice } from "@reduxjs/toolkit";

const defaultColumns = [
  { id: "name", label: "Name", visible: true },
  { id: "email", label: "Email", visible: true },
  { id: "age", label: "Age", visible: true },
  { id: "role", label: "Role", visible: true },
];

const initialState = {
  rows: [
    { name: "gun", email: "gun@example.com", age: 22, role: "Developer" },
    { name: "ram", email: "ram@example.com", age: 34, role: "Designer" },
    { name: "shyam", email: "shyam@example.com", age: 25, role: "PM" },
  ],
  columns: JSON.parse(localStorage.getItem("columns")) || defaultColumns,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addColumn: (state, action) => {
      state.columns.push({
        id: action.payload.id,
        label: action.payload.label,
        visible: true,
      });
      localStorage.setItem("columns", JSON.stringify(state.columns));
      // also add blank values for existing rows
      state.rows = state.rows.map((r) => ({ ...r, [action.payload.id]: "" }));
    },
    toggleColumn: (state, action) => {
      const col = state.columns.find((c) => c.id === action.payload);
      if (col) col.visible = !col.visible;
      localStorage.setItem("columns", JSON.stringify(state.columns));
    },
    addRows: (state, action) => {
      state.rows = [...state.rows, ...action.payload];
    },
    deleteRow: (state, action) => {
      state.rows.splice(action.payload, 1);
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    },
  },
});

export const { addColumn, toggleColumn, addRows, deleteRow, setRows } =
  tableSlice.actions;
export default tableSlice.reducer;



