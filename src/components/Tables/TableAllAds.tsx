"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

interface AdvertisementProps {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  image: string;
  clients: {
    name: string;
    email: string;
  }[];
  createdAt: string;
  status: number;
}

const AdvertisementTable = () => {
  const [advertisements, setAdvertisements] = useState<AdvertisementProps[]>([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState<AdvertisementProps[]>([]);
  const [filterConfig, setFilterConfig] = useState({
    name: "",
    clientName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await api.get("/api/admin/getads", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch advertisements");
        }

        const ads = response.data.data || [];
        setAdvertisements(ads);
        setFilteredAdvertisements(ads);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Failed to load advertisements");
      }
    };

    fetchAdvertisements();
  }, []);

  const applyFilters = () => {
    let filtered = [...advertisements];

    if (filterConfig.name) {
      filtered = filtered.filter((ad) =>
        ad.name.toLowerCase().includes(filterConfig.name.toLowerCase())
      );
    }

    if (filterConfig.clientName) {
      filtered = filtered.filter((ad) =>
        ad.clients.some((client) =>
          client.name.toLowerCase().includes(filterConfig.clientName.toLowerCase())
        )
      );
    }

    if (filterConfig.startDate) {
      const startDate = new Date(filterConfig.startDate).getTime();
      filtered = filtered.filter((ad) => new Date(ad.createdAt).getTime() >= startDate);
    }

    if (filterConfig.endDate) {
      const endDate = new Date(filterConfig.endDate).getTime();
      filtered = filtered.filter((ad) => new Date(ad.createdAt).getTime() <= endDate);
    }

    setFilteredAdvertisements(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, filterKey: string) => {
    setFilterConfig({
      ...filterConfig,
      [filterKey]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilterConfig({
      name: "",
      clientName: "",
      startDate: "",
      endDate: "",
    });
    setFilteredAdvertisements(advertisements);
  };

  const convertToCSV = (ads: AdvertisementProps[]) => {
    const headers = [
      "Advertisement Name",
      "Email",
      "Mobile",
      "Client Name",
      "Client Email",
      "Date & Time",
      "Status",
    ];

    const rows = ads
      .map((ad) =>
        ad.clients.map((client) => [
          ad.name,
          ad.email,
          ad.mobile,
          client.name,
          client.email,
          new Date(ad.createdAt).toLocaleString(),
          ad.status === 1 ? "Active" : "Inactive",
        ])
      )
      .flat();

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(filteredAdvertisements);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "advertisements_report.csv");
    link.click();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="mr-2">Advertisement Name:</label>
            <input
              type="text"
              value={filterConfig.name}
              onChange={(e) => handleFilterChange(e, "name")}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="mr-2">Client Name:</label>
            <input
              type="text"
              value={filterConfig.clientName}
              onChange={(e) => handleFilterChange(e, "clientName")}
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
                Advertisement Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Client Name
              </th>
              <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">
                Client Email
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Mobile
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Date & Time
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvertisements.length > 0 ? (
              filteredAdvertisements.map((ad) =>
                ad.clients.map((client, index) => (
                  <tr key={`${ad._id}-${index}`}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">{ad.name}</h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{client.name}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{client.email}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{ad.mobile}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{new Date(ad.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {ad.status === 1 ? "Active" : "Inactive"}
                      </p>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No advertisements available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertisementTable;