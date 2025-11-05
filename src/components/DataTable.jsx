import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteRow, setRows } from "../features/tableSlice";

export default function DataTable() {
    const { rows, columns } = useSelector((s) => s.table);
    const dispatch = useDispatch();
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("asc");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const [edited, setEdited] = useState({});
    const [errors, setErrors] = useState({});

    const visibleColumns = columns.filter((c) => c.visible);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = rows;
        if (q) {
            list = list.filter((r) =>
                visibleColumns.some((c) =>
                    String(r[c.id] ?? "").toLowerCase().includes(q)
                )
            );
        }
        if (orderBy) {
            list = [...list].sort((a, b) => {
                const va = a[orderBy],
                    vb = b[orderBy];
                if (va === vb) return 0;
                if (order === "asc") return va > vb ? 1 : -1;
                return va > vb ? -1 : 1;
            });
        }
        return list;
    }, [rows, query, orderBy, order, visibleColumns]);

    const openEditFor = (index) => {
        setEdited((prev) => ({
            ...prev,
            [index]: { ...rows[index] },
        }));
    };

    const handleFieldChange = (index, field, value) => {
        setEdited((prev) => ({
            ...prev,
            [index]: { ...prev[index], [field]: value },
        }));

        if (field === "age") {
            setErrors((prev) => {
                const rowErr = prev[index] ? { ...prev[index] } : {};
                if (value === "" || isNaN(Number(value))) rowErr.age = "Age must be a number";
                else delete rowErr.age;
                return { ...prev, [index]: Object.keys(rowErr).length ? rowErr : undefined };
            });
        }
    };

    const handleSaveAll = () => {
        const newErrors = {};
        Object.entries(edited).forEach(([i, row]) => {
            if (row.age === "" || isNaN(Number(row.age))) {
                newErrors[i] = { age: "Age must be a number" };
            }
        });

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        const newRows = [...rows];
        Object.entries(edited).forEach(([i, r]) => {
            const fixed = { ...r };
            fixed.age = Number(fixed.age);
            newRows[i] = fixed;
        });
        dispatch(setRows(newRows));
        setEdited({});
        setErrors({});
    };

    const handleCancelAll = () => {
        setEdited({});
        setErrors({});
    };

    const handleDelete = (index) => {
        if (window.confirm("Are you sure you want to delete this row?")) {
            dispatch(deleteRow(index));
        }
    };

    return (
        <div>
            {/* Top Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Search box */}
                <div className="flex-grow sm:flex-grow-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none w-full sm:w-72"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}/>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={handleSaveAll}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all">Save All
                    </button>
                    <button
                        onClick={handleCancelAll}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">Cancel All
                    </button>
                </div>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Validation errors:</strong>
                    <ul className="mt-2 list-disc ml-5">
                        {Object.entries(errors).map(([idx, err]) =>
                            err ? (
                                <li key={idx}>
                                    Row {Number(idx) + 1}: {err.age}
                                </li>
                            ) : null
                        )}
                    </ul>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 uppercase font-semibold">
                        <tr>
                            {visibleColumns.map((col) => (
                                <th
                                    key={col.id}
                                    onClick={() => {
                                        const isAsc = orderBy === col.id && order === "asc";
                                        setOrder(isAsc ? "desc" : "asc");
                                        setOrderBy(col.id);
                                    }}
                                    className="px-4 py-3 text-left cursor-pointer select-none">
                                    {col.label}
                                    {orderBy === col.id && (
                                        <span className="ml-1 text-blue-500">
                                            {order === "asc" ? "▲" : "▼"}
                                        </span>
                                    )}
                                </th>
                            ))}
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={visibleColumns.length + 1}
                                    className="text-center py-6 text-gray-400">No data found
                                </td>
                            </tr>
                        ) : (
                            filtered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, i) => {
                                    const globalIndex = i + page * rowsPerPage;
                                    const isEditing = edited[globalIndex];
                                    const rowErrors = errors[globalIndex] || {};

                                    return (
                                        <tr
                                            key={globalIndex}
                                            className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                            onDoubleClick={() => openEditFor(globalIndex)}>
                                            {visibleColumns.map((col) => (
                                                <td key={col.id} className="px-4 py-3 align-top">
                                                    {isEditing ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={edited[globalIndex][col.id] ?? ""}
                                                                onChange={(e) =>
                                                                    handleFieldChange(
                                                                        globalIndex,
                                                                        col.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className={`px-2 py-1 border rounded w-full ${rowErrors.age && col.id === "age"
                                                                    ? "border-red-500"
                                                                    : "border-gray-300"
                                                                    }`}/>
                                                            {col.id === "age" && rowErrors.age && (
                                                                <div className="text-xs text-red-600 mt-1">
                                                                    {rowErrors.age}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div>{row[col.id]}</div>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => openEditFor(globalIndex)}
                                                        className="text-blue-600 hover:underline">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(globalIndex)}
                                                        className="text-red-600 hover:underline">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
                <span>
                    Showing {page * rowsPerPage + 1}–
                    {Math.min((page + 1) * rowsPerPage, filtered.length)} of{" "}
                    {filtered.length}
                </span>
                <div className="space-x-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1.5 bg-gray-100 border rounded-lg disabled:opacity-50 hover:bg-gray-200">
                        Prev
                    </button>
                    <button
                        disabled={(page + 1) * rowsPerPage >= filtered.length}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1.5 bg-gray-100 border rounded-lg disabled:opacity-50 hover:bg-gray-200">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}


