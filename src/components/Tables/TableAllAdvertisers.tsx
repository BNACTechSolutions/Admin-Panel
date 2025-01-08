"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import api from "@/api";
import AddAdsUser from "@/components/Dashboard/AddAdsUser";

interface AdvertiserProps {
  _id: string;
  serialNumber: number;
  name: string;
  email: string;
  mobile: string;
  active: boolean;
}

const AllAdvertisers = () => {
  const [advertisers, setAdvertisers] = useState<AdvertiserProps[]>([]);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<AdvertiserProps[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [showAddAdvertiser, setShowAddAdvertiser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/admin/advertisers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch advertisers");
        }

        const advertisersData = response.data.advertisers || [];
        const advertisersWithSerials = advertisersData.map((advertiser: any, index: number) => ({
          ...advertiser,
          serialNumber: index + 1,
        }));

        setAdvertisers(advertisersWithSerials);
        setFilteredAdvertisers(advertisersWithSerials);
      } catch (error) {
        console.error("Error fetching advertisers:", error);
        toast.error("Failed to load advertisers");
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...advertisers];
    if (filters.name) {
      filtered = filtered.filter((advertiser) =>
        advertiser.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.email) {
      filtered = filtered.filter((advertiser) =>
        advertiser.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.mobile) {
      filtered = filtered.filter((advertiser) =>
        advertiser.mobile.includes(filters.mobile)
      );
    }
    setFilteredAdvertisers(filtered);
  };

  const clearFilters = () => {
    setFilters({ name: "", email: "", mobile: "" });
    setFilteredAdvertisers(advertisers);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = (index: number) => {
    setEditMode(index);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.put(
        `/api/admin/advertisers/${id}/status`,
        { active: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Failed to update advertiser status");
      }
  
      toast.success(`Advertiser is now ${!currentStatus ? "Active" : "Inactive"}`);
      setAdvertisers((prev) =>
        prev.map((advertiser) =>
          advertiser._id === id
            ? { ...advertiser, active: !currentStatus }
            : advertiser
        )
      );
      setFilteredAdvertisers((prev) =>
        prev.map((advertiser) =>
          advertiser._id === id
            ? { ...advertiser, active: !currentStatus }
            : advertiser
        )
      );
    } catch (error) {
      console.error("Error updating advertiser status:", error);
      toast.error("Failed to update advertiser status");
    }
  };
  

  const handleSave = async (index: number) => {
    const updatedAdvertiser = filteredAdvertisers[index];
    try {
      const response = await api.put(
        `/api/admin/advertisers/${updatedAdvertiser._id}`,
        {
          name: updatedAdvertiser.name,
          email: updatedAdvertiser.email,
          mobile: updatedAdvertiser.mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to save advertiser");
      }

      toast.success("Advertiser updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Error saving advertiser:", error);
      toast.error("Failed to update advertiser");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertiser?")) return;

    try {
      const response = await api.delete(`/api/admin/advertisers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete advertiser");
      }

      toast.success("Advertiser deleted successfully");
      setAdvertisers((prev) => prev.filter((advertiser) => advertiser._id !== id));
      setFilteredAdvertisers((prev) => prev.filter((advertiser) => advertiser._id !== id));
    } catch (error) {
      console.error("Error deleting advertiser:", error);
      toast.error("Failed to delete advertiser");
    }
  };

  const downloadAsCSV = () => {
    const csvRows = [
      ["Serial Number", "Name", "Email", "Mobile"],
      ...filteredAdvertisers.map((advertiser) => [
        advertiser.serialNumber,
        advertiser.name,
        advertiser.email,
        advertiser.mobile,
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Advertisers.csv");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          name="name"
          value={filters.name}
          placeholder="Filter by Name"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="email"
          value={filters.email}
          placeholder="Filter by Email"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="mobile"
          value={filters.mobile}
          placeholder="Filter by Mobile"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
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
          onClick={() => setShowAddAdvertiser(true)}
          className="ml-4 px-4 py-2 bg-blue-700 text-white rounded"
        >
          Add Advertiser
        </button>
      </div>

      {showAddAdvertiser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <AddAdsUser onClose={() => setShowAddAdvertiser(false)} />
          </div>
        </div>
      )}

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left">
            <th className="px-4 py-4 font-medium text-black">Serial Number</th>
            <th className="px-4 py-4 font-medium text-black">Name</th>
            <th className="px-4 py-4 font-medium text-black">Email</th>
            <th className="px-4 py-4 font-medium text-black">Mobile</th>
            <th className="px-4 py-4 font-medium text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvertisers.map((advertiser, index) => (
            <tr key={index}>
              <td className="px-4 py-5">{advertiser.serialNumber}</td>
              <td className="px-4 py-5">
                {editMode === index ? (
                  <input
                    type="text"
                    value={advertiser.name}
                    onChange={(e) =>
                      setFilteredAdvertisers((prev) =>
                        prev.map((ad, i) =>
                          i === index ? { ...ad, name: e.target.value } : ad
                        )
                      )
                    }
                    className="px-3 py-2 border rounded"
                  />
                ) : (
                  advertiser.name
                )}
              </td>
              <td className="px-4 py-5">
                {editMode === index ? (
                  <input
                    type="text"
                    value={advertiser.email}
                    onChange={(e) =>
                      setFilteredAdvertisers((prev) =>
                        prev.map((ad, i) =>
                          i === index ? { ...ad, email: e.target.value } : ad
                        )
                      )
                    }
                    className="px-3 py-2 border rounded"
                  />
                ) : (
                  advertiser.email
                )}
              </td>
              <td className="px-4 py-5">
                {editMode === index ? (
                  <input
                    type="text"
                    value={advertiser.mobile}
                    onChange={(e) =>
                      setFilteredAdvertisers((prev) =>
                        prev.map((ad, i) =>
                          i === index ? { ...ad, mobile: e.target.value } : ad
                        )
                      )
                    }
                    className="px-3 py-2 border rounded"
                  />
                ) : (
                  advertiser.mobile
                )}
              </td>
              <td className="px-4 py-5">
                {editMode === index ? (
                  <>
                    <button
                      onClick={() => handleSave(index)}
                      className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(index)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        toggleActiveStatus(advertiser._id, advertiser.active)
                      }
                      className={`px-3 py-1 rounded ${
                        advertiser.active ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {advertiser.active ? "Deactivate" : "Activate"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAdvertisers;
