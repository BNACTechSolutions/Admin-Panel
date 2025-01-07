"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

interface QRScanLogProps {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
  };
  shortUrl: string;
  ipAddress: string;
  deviceType: string;
  scanTimestamp: string;
  redirectMappingId: {
    _id: string;
    shortUrl: string;
    redirectUrl: string;
  };
}

const QRScanLogTableClient = () => {
  const [logs, setLogs] = useState<QRScanLogProps[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<QRScanLogProps[]>([]);
  const [filterConfig, setFilterConfig] = useState({
    shortUrl: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/api/client/qr-scans", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch QR scan logs");
        }

        const scans = response.data.scans || [];
        setLogs(scans);
        setFilteredLogs(scans);
      } catch (error) {
        console.error("Error fetching QR scan logs:", error);
        toast.error("Failed to load QR scan logs");
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on the selected filters
  const applyFilters = () => {
    let filtered = [...logs];

    // Filter by short URL
    if (filterConfig.shortUrl) {
      filtered = filtered.filter(log =>
        log.shortUrl.toLowerCase().includes(filterConfig.shortUrl.toLowerCase())
      );
    }

    // Filter by date range
    if (filterConfig.startDate) {
      const startDate = new Date(filterConfig.startDate).getTime();
      filtered = filtered.filter(log => new Date(log.scanTimestamp).getTime() >= startDate);
    }
    if (filterConfig.endDate) {
      const endDate = new Date(filterConfig.endDate).getTime();
      filtered = filtered.filter(log => new Date(log.scanTimestamp).getTime() <= endDate);
    }

    setFilteredLogs(filtered);
  };

  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterKey: string) => {
    setFilterConfig({
      ...filterConfig,
      [filterKey]: e.target.value,
    });
  };

  // Handle reset of all filters
  const resetFilters = () => {
    setFilterConfig({
      shortUrl: "",
      startDate: "",
      endDate: "",
    });
    setFilteredLogs(logs); // Reset to show all logs
  };

  // Convert filtered logs to CSV format
  const convertToCSV = (logs: QRScanLogProps[]) => {
    const headers = [
      "Short URL",
      "IP Address",
      "Device Type",
      "Date & Time",
    ];

    const rows = logs.map(log => [
      log.shortUrl,
      log.ipAddress,
      log.deviceType,
      new Date(log.scanTimestamp).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  // Download the filtered logs as a CSV file
  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "qr_scan_logs_client.csv");
    link.click();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Short URL:</label>
            <input
              type="text"
              value={filterConfig.shortUrl}
              onChange={(e) => handleFilterChange(e, "shortUrl")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="mr-2">Start Date:</label>
            <input
              type="date"
              value={filterConfig.startDate}
              onChange={(e) => handleFilterChange(e, "startDate")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="mr-2">End Date:</label>
            <input
              type="date"
              value={filterConfig.endDate}
              onChange={(e) => handleFilterChange(e, "endDate")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <button onClick={applyFilters} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
            Apply Filters
          </button>
          <button onClick={resetFilters} className="ml-4 px-4 py-2 bg-gray-500 text-white rounded">
            Reset Filters
          </button>
          <button onClick={downloadCSV} className="ml-4 px-4 py-2 bg-green-500 text-white rounded">
            Download Report
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Short URL
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                IP Address
              </th>
              <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">
                Device Type
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{log.shortUrl}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.ipAddress}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.deviceType}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(log.scanTimestamp).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QRScanLogTableClient;