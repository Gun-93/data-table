# Dynamic Data Table Manager  

This project is built using **React (Vite)**, **Redux Toolkit**, and **Tailwind CSS**.  

---
## Live Link deployed on Netlify : https://dtmfgc.netlify.app/

###  Table View
- Displays a table with default columns:
  - **Name**, **Email**, **Age**, **Role**
- Click any **column header** to toggle sorting (ascending / descending)
- Global **search bar** filters across all fields
- **Pagination**: shows **10 rows per page**
- Inline row editing:
  - Double-click a row or click **Edit**
  - Update fields directly
  - Validates numeric fields (e.g. Age)
  - Use **Save All / Cancel All** to apply or discard edits
- Row actions:
  - **Edit** / **Delete (with confirmation)**

---

###  Dynamic Columns
- **Manage Columns** modal allows you to:
  - Show / hide any existing column via checkboxes  
  - Add new columns dynamically (e.g. Department, Location)
- Column visibility and order are **persisted in localStorage**
- Added columns immediately appear in the table and can be edited

---

###  Import & Export CSV
- **Import CSV**:
  - Upload `.csv` files parsed with **PapaParse**
  - Validates column format
  - Shows error alerts for invalid columns
- **Export CSV**:
  - Exports current table view to a `.csv` file
  - Includes **only visible columns**
  - Implemented using **FileSaver.js**

---

###  Sorting, Search & Pagination
- Click a column header to toggle **ASC / DESC** order
- Global search box filters all visible rows
- **Client-side pagination** (10 rows per page)
- Displays current page info (e.g. “Page 1 of 3”)

---

## 🧑‍💻 Technologies Used
- **React (Vite)**
- **Redux Toolkit**
- **Tailwind CSS**
- **PapaParse** (CSV parsing)
- **FileSaver.js** (CSV export)
- **JavaScript**

---






