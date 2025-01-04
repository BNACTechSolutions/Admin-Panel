"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

interface SetLogsProps {
  email: string;
  ipAddress: string;
  action: string;
  timestamp: string;
}

const ActivityLogTable = () => {
  const [logs, setLogs] = useState<SetLogsProps[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SetLogsProps[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: "timestamp",
    direction: "asc",
  });
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("api/admin/logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch logs");
        }

        setLogs(response.data || []);
        setFilteredLogs(response.data || []);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        toast.error("Failed to load activity logs");
      }
    };

    fetchLogs();
  }, []);

  const handleSort = (key: keyof SetLogsProps) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
  
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      if (key === "timestamp") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
  
    setFilteredLogs(sortedLogs);
    setSortConfig({ key, direction });
  };  

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
    const newDateFilter = { ...dateFilter, [type]: e.target.value };
    setDateFilter(newDateFilter);

    const filteredByDate = logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(newDateFilter.start);
      const endDate = new Date(newDateFilter.end);

      return (
        (!newDateFilter.start || logDate >= startDate) &&
        (!newDateFilter.end || logDate <= endDate)
      );
    });

    setFilteredLogs(filteredByDate);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Start Date:</label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => handleDateFilterChange(e, "start")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="mr-2">End Date:</label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => handleDateFilterChange(e, "end")}
              className="px-3 py-2 border rounded"
            />
          </div>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11 cursor-pointer"
                onClick={() => handleSort("ipAddress")}
              >
                IP Address
              </th>
              <th
                className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
              </th>
              <th
                className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("action")}
              >
                Action
              </th>
              <th
                className="px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("timestamp")}
              >
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {log.ipAddress}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{log.email}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{log.action}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogTable;