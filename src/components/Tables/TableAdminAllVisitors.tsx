"use client";

import { useState, useEffect } from "react";
import api from "@/api";

interface Visitor {
  _id: string;
  name: string;
  mobile: string;
  clientId?: { name: string };  // clientId is optional since it may not always be present
  timestamp: string;
}

const VisitorTable = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [sortField, setSortField] = useState<keyof Visitor>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterName, setFilterName] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState<string | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<string | null>(null);
  const [filterClientName, setFilterClientName] = useState("");
  const [filterMobile, setFilterMobile] = useState("");

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await api.get("api/admin/get-visitor-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch visitors");
        }
        const data = response.data;
        setVisitors(data);
        setFilteredVisitors(data); // Initially, no filter
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, []);

  const handleSort = (field: keyof Visitor) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedVisitors = [...filteredVisitors].sort((a, b) => {
      if (a[field] === undefined || b[field] === undefined) {
        return 0; // If either value is undefined, no sorting is performed
      }
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredVisitors(sortedVisitors);
  };

  const handleFilterChange = () => {
    let filtered = [...visitors];

    if (filterName) {
      filtered = filtered.filter((visitor) =>
        visitor.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterClientName) {
      filtered = filtered.filter((visitor) =>
        visitor.clientId?.name.toLowerCase().includes(filterClientName.toLowerCase())
      );
    }

    if (filterMobile) {
      filtered = filtered.filter((visitor) =>
        visitor.mobile.includes(filterMobile)
      );
    }

    if (filterDateFrom) {
      filtered = filtered.filter((visitor) => new Date(visitor.timestamp) >= new Date(filterDateFrom));
    }

    if (filterDateTo) {
      filtered = filtered.filter((visitor) => new Date(visitor.timestamp) <= new Date(filterDateTo));
    }

    setFilteredVisitors(filtered);
  };

  const handleClearFilters = () => {
    setFilterName("");
    setFilterMobile("");
    setFilterClientName("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setFilteredVisitors(visitors);
  };

  const handleCSVDownload = () => {
    const csvRows = [];
    const headers = ["Serial No.", "Name", "Mobile", "Client Name", "Timestamp"];
    csvRows.push(headers.join(","));

    filteredVisitors.forEach((visitor, index) => {
      const row = [
        index + 1, // Serial Number (index + 1)
        visitor.name,
        visitor.mobile,
        visitor.clientId ? visitor.clientId.name : "N/A", // If clientId exists, show name, else N/A
        new Date(visitor.timestamp).toLocaleString(),
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "visitors.csv");
      link.click();
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-medium text-black dark:text-white">Visitor Data</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCSVDownload}
        >
          Download CSV
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-4 mb-4">
          {/* Filters Row 1 */}
          <input
            type="text"
            placeholder="Filter by Name"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
            }}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Filter by Mobile"
            value={filterMobile}
            onChange={(e) => {
              setFilterMobile(e.target.value);
            }}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Filter by Client Name"
            value={filterClientName}
            onChange={(e) => {
              setFilterClientName(e.target.value);
            }}
            className="border p-2"
          />
        </div>

        <div className="flex gap-4">
          {/* Filters Row 2 (Date Filters with From & To) */}
          <div className="flex flex-col">
            <label htmlFor="dateFrom" className="mb-1 text-sm text-gray-700">From</label>
            <input
              id="dateFrom"
              type="date"
              value={filterDateFrom || ""}
              onChange={(e) => {
                setFilterDateFrom(e.target.value);
              }}
              className="border p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dateTo" className="mb-1 text-sm text-gray-700">To</label>
            <input
              id="dateTo"
              type="date"
              value={filterDateTo || ""}
              onChange={(e) => {
                setFilterDateTo(e.target.value);
              }}
              className="border p-2"
            />
          </div>
          <div className="flex items-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleFilterChange}
            >
              Apply Filter
            </button>
          </div>
          <div className="flex items-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleClearFilters}
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
              >
                Serial No.
              </th>
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("mobile")}
              >
                Mobile {sortField === "mobile" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("clientId")}
              >
                Client Name {sortField === "clientId" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("timestamp")}
              >
                Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map((visitor, index) => (
              <tr key={visitor._id}>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">{index + 1}</td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">{visitor.name}</td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">{visitor.mobile}</td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {visitor.clientId ? visitor.clientId.name : "N/A"}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">{new Date(visitor.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorTable;