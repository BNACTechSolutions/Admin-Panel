"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import api from "@/api";
import AddAdvertisement from "@/components/Dashboard/AddAdvertisements";
import EditAdvertisement from "@/components/Dashboard/EditAdvertisements";

interface AdvertisementProps {
  _id: string;
  serialNumber: number;
  adName: string;
  adImage: string;
  active: boolean;
  advertiserId: {
    name: string;
  };
}

const AllAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<AdvertisementProps[]>([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState<AdvertisementProps[]>([]);
  const [filters, setFilters] = useState({
    adName: "",
    advertiserName: "",
    status: "",
  });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [showAddAdvertisement, setShowAddAdvertisement] = useState(false);
  const [showEditAdvertisement, setShowEditAdvertisement] = useState<AdvertisementProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/admin/advertisements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch advertisements");
        }

        const advertisementsData = response.data.advertisements || [];
        const advertisementsWithSerials = advertisementsData.map(
          (advertisement: any, index: number) => ({
            ...advertisement,
            serialNumber: index + 1,
          })
        );

        setAdvertisements(advertisementsWithSerials);
        setFilteredAdvertisements(advertisementsWithSerials);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Failed to load advertisements");
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...advertisements];

    if (filters.adName) {
      filtered = filtered.filter((advertisement) =>
        advertisement.adName.toLowerCase().includes(filters.adName.toLowerCase())
      );
    }

    if (filters.advertiserName) {
      filtered = filtered.filter((advertisement) =>
        advertisement.advertiserId.name.toLowerCase().includes(filters.advertiserName.toLowerCase())
      );
    }

    if (filters.status !== "") {
      filtered = filtered.filter(
        (advertisement) => (filters.status === "active" && advertisement.active) || (filters.status === "inactive" && !advertisement.active)
      );
    }

    setFilteredAdvertisements(filtered);
  };

  const clearFilters = () => {
    setFilters({ adName: "", advertiserName: "", status: "" });
    setFilteredAdvertisements(advertisements);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleToggleStatus = async (id: string, active: boolean) => {
    try {
      const response = await api.put(
        `/api/admin/advertisements/${id}/status`,
        { active: !active },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success(response.data.message);
      // Update local state immediately to reflect the status change in the UI
      setAdvertisements((prev) =>
        prev.map((advertisement) =>
          advertisement._id === id
            ? { ...advertisement, active: !active }
            : advertisement
        )
      );
      // Also update the filtered list if needed
      setFilteredAdvertisements((prev) =>
        prev.map((advertisement) =>
          advertisement._id === id
            ? { ...advertisement, active: !active }
            : advertisement
        )
      );
    } catch (error) {
      console.error("Error updating advertisement status:", error);
      toast.error("Failed to update advertisement status");
    }
  };

  const downloadAsCSV = () => {
    const csvRows = [
      ["Serial Number", "Advertisement Name", "Advertiser Name", "Active Status"],
      ...filteredAdvertisements.map((advertisement) => [
        advertisement.serialNumber,
        advertisement.adName,
        advertisement.advertiserId.name,
        advertisement.active ? "Active" : "Inactive",
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Advertisements.csv");
  };

  return (
    <div className="rounded-sm border border-stroke dark:border-strokedark bg-white dark:bg-boxdark px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          name="adName"
          value={filters.adName}
          placeholder="Filter by Advertisement Name"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="advertiserName"
          value={filters.advertiserName}
          placeholder="Filter by Advertiser Name"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded ml-4"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded ml-4"
        >
          <option value="">Filter by Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={applyFilters} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
          Apply Filters
        </button>
        <button onClick={clearFilters} className="ml-4 px-4 py-2 bg-gray-500 text-white rounded">
          Clear Filters
        </button>
        <button onClick={downloadAsCSV} className="ml-4 px-4 py-2 bg-green-500 text-white rounded">
          Download CSV
        </button>
        <button
          onClick={() => setShowAddAdvertisement(true)}
          className="ml-4 px-4 py-2 bg-blue-700 text-white rounded"
        >
          Add Advertisement
        </button>
      </div>

      {/* Add Advertisement Modal */}
      {showAddAdvertisement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-boxdark p-6 rounded">            <AddAdvertisement onClose={() => setShowAddAdvertisement(false)} />
          </div>
        </div>
      )}

      {/* Edit Advertisement Modal */}
      {showEditAdvertisement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-boxdark p-6 rounded">            <EditAdvertisement
              advertisement={showEditAdvertisement}
              onClose={() => setShowEditAdvertisement(null)}
              onUpdate={(updatedAd) => {
                setAdvertisements((prev) =>
                  prev.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad))
                );
                setFilteredAdvertisements((prev) =>
                  prev.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad))
                );
                setShowEditAdvertisement(null); // Close the modal
              }}
            />
          </div>
        </div>
      )}

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 dark:bg-meta-4 text-left">            <th className="px-4 py-4 font-medium text-black">Serial Number</th>
            <th className="px-4 py-4 font-medium text-black">Advertisement Name</th>
            <th className="px-4 py-4 font-medium text-black">Advertiser Name</th>
            <th className="px-4 py-4 font-medium text-black">Status</th>
            <th className="px-4 py-4 font-medium text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvertisements.map((advertisement, index) => (
            <tr key={advertisement._id}>
              <td className="px-4 py-5">{advertisement.serialNumber}</td>
              <td className="px-4 py-5">{advertisement.adName}</td>
              <td className="px-4 py-5">{advertisement.advertiserId.name}</td>
              <td className="px-4 py-5 text-black dark:text-white">                <span
                  className={`px-2 py-1 rounded ${
                    advertisement.active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {advertisement.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-5 text-black dark:text-white">                <button
                  onClick={() => handleToggleStatus(advertisement._id, advertisement.active)}
                  className={`px-3 py-1 rounded ${
                    advertisement.active ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                >
                  {advertisement.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setShowEditAdvertisement(advertisement)}
                  className="ml-2 px-3 py-1 rounded bg-blue-500 text-white"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAdvertisements;
