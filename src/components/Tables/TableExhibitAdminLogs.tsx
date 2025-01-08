"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

interface ExhibitLogProps {
  _id: string;
  serialNumber: number;
  clientName: string;
  exhibitCode: string;
  dateTime: string;
  userMobile: string;
  deviceType: string;
  ipAddress: string;
  advertisementId: string;
}

const ExhibitLogTable = () => {
  const [logs, setLogs] = useState<ExhibitLogProps[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ExhibitLogProps[]>([]);
  const [filterConfig, setFilterConfig] = useState({
    exhibitCode: "",
    clientName: "",
    userMobile: "",
    advertisementName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/api/admin/exhibit-logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch exhibit logs");
        }

        const exhibitLogs = response.data || [];
        setLogs(exhibitLogs);
        setFilteredLogs(exhibitLogs);
      } catch (error) {
        console.error("Error fetching exhibit logs:", error);
        toast.error("Failed to load exhibit logs");
      }
    };

    fetchLogs();
  }, []);

  const applyFilters = () => {
    let filtered = [...logs];

    if (filterConfig.exhibitCode) {
      filtered = filtered.filter(log =>
        log.exhibitCode.toLowerCase().includes(filterConfig.exhibitCode.toLowerCase())
      );
    }

    if (filterConfig.clientName) {
      filtered = filtered.filter(log =>
        log.clientName.toLowerCase().includes(filterConfig.clientName.toLowerCase())
      );
    }

    if (filterConfig.userMobile) {
      filtered = filtered.filter(log =>
        log.userMobile.includes(filterConfig.userMobile)
      );
    }

    if (filterConfig.advertisementName) {
      filtered = filtered.filter(log =>
        log.advertisementId.toLowerCase().includes(filterConfig.advertisementName.toLowerCase())
      );
    }

    if (filterConfig.startDate) {
      const startDate = new Date(filterConfig.startDate).getTime();
      filtered = filtered.filter(log => new Date(log.dateTime).getTime() >= startDate);
    }
    if (filterConfig.endDate) {
      const endDate = new Date(filterConfig.endDate).getTime();
      filtered = filtered.filter(log => new Date(log.dateTime).getTime() <= endDate);
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterKey: string) => {
    setFilterConfig({
      ...filterConfig,
      [filterKey]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilterConfig({
      exhibitCode: "",
      clientName: "",
      userMobile: "",
      advertisementName: "",
      startDate: "",
      endDate: "",
    });
    setFilteredLogs(logs);
  };

  const convertToCSV = (logs: ExhibitLogProps[]) => {
    const headers = [
      "Exhibit Code",
      "Client Name",
      "Serial Number",
      "Device Type",
      "IP Address",
      "Date & Time",
      "Mobile Number",
      "Advertisement Name",
    ];

    const rows = logs.map((log, index) => [
      log.exhibitCode,
      log.clientName,
      index + 1,  // Sequential serial number
      log.deviceType,
      log.ipAddress,
      new Date(log.dateTime).toLocaleString(),
      log.userMobile,
      log.advertisementId,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "exhibit_logs.csv");
    link.click();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <label className="mr-2">Exhibit Code:</label>
            <input
              type="text"
              value={filterConfig.exhibitCode}
              onChange={(e) => handleFilterChange(e, "exhibitCode")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <label className="mr-2">Client Name:</label>
            <input
              type="text"
              value={filterConfig.clientName}
              onChange={(e) => handleFilterChange(e, "clientName")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <label className="mr-2">Mobile Number:</label>
            <input
              type="text"
              value={filterConfig.userMobile}
              onChange={(e) => handleFilterChange(e, "userMobile")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <label className="mr-2">Advertisement Name:</label>
            <input
              type="text"
              value={filterConfig.advertisementName}
              onChange={(e) => handleFilterChange(e, "advertisementName")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <label className="mr-2">Start Date:</label>
            <input
              type="date"
              value={filterConfig.startDate}
              onChange={(e) => handleFilterChange(e, "startDate")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <label className="mr-2">End Date:</label>
            <input
              type="date"
              value={filterConfig.endDate}
              onChange={(e) => handleFilterChange(e, "endDate")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="px-4 py-2 bg-gray-500 text-white rounded">
              Reset Filters
            </button>
            <button onClick={downloadCSV} className="px-4 py-2 bg-green-500 text-white rounded">
              Download Report
            </button>
          </div>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Serial Number
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Exhibit Code
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Client Name
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Device Type
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                IP Address
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Date & Time
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Mobile Number
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Advertisement Name
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={log._id}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{index + 1}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{log.exhibitCode}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.clientName}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.deviceType}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.ipAddress}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(log.dateTime).toLocaleString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.userMobile}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{log.advertisementId}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
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

export default ExhibitLogTable;