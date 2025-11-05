import Papa from "papaparse";

export function parseCsv(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        resolve({ data: results.data, errors: [] });
      },
      error(err) {
        resolve({ data: [], errors: [err.message] });
      },
    });
  });
}

export function exportCsv(rows, columns) {
  const csvRows = rows.map((r) => {
    const obj = {};
    columns.forEach((c) => (obj[c] = r[c] ?? ""));
    return obj;
  });
  const csv = Papa.unparse(csvRows);
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

