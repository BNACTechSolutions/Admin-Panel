"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import api from "@/api";
import { jwtDecode } from "jwt-decode";

interface Admin {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  user_type: number; // 1 for Admin, 2 for Manager
  status: number; // 1 for Active, 0 for Inactive
  created_at: string;
}

const AdminTable = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [currentUserType, setCurrentUserType] = useState<number | null>(null);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<Admin | null>(null);

  // Filters
  const [filterName, setFilterName] = useState<string>("");
  const [filterMobile, setFilterMobile] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Fetch admins and decode user_type on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get("api/admin/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch admins");
        }
        const data = response.data;

        // Filter admins to exclude super admin
        const filteredAdmins = data.filter(
          (admin: Admin) => admin.user_type !== 0
        );
        setAdmins(filteredAdmins);
        setFilteredAdmins(filteredAdmins); // Set filtered list to full list initially
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    const decodeUserType = () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No token found");
        const decoded: any = jwtDecode(token);
        setCurrentUserType(decoded.user_type);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchAdmins();
    decodeUserType();
  }, []);

  const handleEditClick = (admin: Admin) => {
    setEditingAdminId(admin._id);
    setEditedAdmin({ ...admin });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    if (editedAdmin) {
      setEditedAdmin({
        ...editedAdmin,
        [field]: e.target.value,
      });
    }
  };  

  const handleSave = async () => {
    if (editedAdmin) {
      try {
        const response = await api.put(
          `api/admin/${editedAdmin._id}`,
          { ...editedAdmin },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Admin details updated successfully!");
          setAdmins((prev) =>
            prev.map((admin) =>
              admin._id === editedAdmin._id ? { ...editedAdmin } : admin
            )
          );
          setFilteredAdmins((prev) =>
            prev.map((admin) =>
              admin._id === editedAdmin._id ? { ...editedAdmin } : admin
            )
          );
          setEditingAdminId(null); // Reset editing state
          setEditedAdmin(null); // Clear the edited admin
        } else {
          throw new Error("Failed to update admin details.");
        }
      } catch (error) {
        console.error("Error updating admin details:", error);
        alert("Error updating admin details.");
      }
    }
  };

  const handleCancel = () => {
    setEditingAdminId(null);
    setEditedAdmin(null);
  };

  const applyFilter = () => {
    let filtered = admins;

    if (filterName.trim() !== "") {
      filtered = filtered.filter((admin) =>
        admin.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterMobile.trim() !== "") {
      filtered = filtered.filter((admin) =>
        admin.mobile.includes(filterMobile)
      );
    }

    if (filterStatus !== "") {
      filtered = filtered.filter(
        (admin) => admin.status === parseInt(filterStatus)
      );
    }

    setFilteredAdmins(filtered);
  };

  const clearFilter = () => {
    setFilterName("");
    setFilterMobile("");
    setFilterStatus("");
    setFilteredAdmins(admins); // Reset to original list
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col space-y-4 mb-5">
        <h2 className="text-lg font-medium text-black dark:text-white">
          Admin Users
        </h2>
        {/* Filters */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Filter by name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Filter by mobile"
            value={filterMobile}
            onChange={(e) => setFilterMobile(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={applyFilter}
          >
            Apply Filter
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={clearFilter}
          >
            Clear Filter
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Mobile
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin._id}>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {editingAdminId === admin._id ? (
                    <input
                      type="text"
                      value={editedAdmin?.name}
                      onChange={(e) => handleChange(e, "name")}
                      className="border border-gray-300 p-1 rounded-md"
                    />
                  ) : (
                    admin.name
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {editingAdminId === admin._id ? (
                    <input
                      type="email"
                      value={editedAdmin?.email}
                      onChange={(e) => handleChange(e, "email")}
                      className="border border-gray-300 p-1 rounded-md"
                    />
                  ) : (
                    admin.email
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {editingAdminId === admin._id ? (
                    <input
                      type="text"
                      value={editedAdmin?.mobile}
                      onChange={(e) => handleChange(e, "mobile")}
                      className="border border-gray-300 p-1 rounded-md"
                    />
                  ) : (
                    admin.mobile
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {editingAdminId === admin._id ? (
                    <select
                      value={editedAdmin?.status}
                      onChange={(e) => handleChange(e, "status")}
                      className="border border-gray-300 p-1 rounded-md"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  ) : (
                    admin.status === 1 ? "Active" : "Inactive"
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  <div className="flex items-center space-x-3.5">
                    {editingAdminId === admin._id ? (
                      <div className="flex items-center">
                        <button
                          className="ml-2 text-green-500 hover:underline"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="ml-2 text-red-500 hover:underline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEditClick(admin)}
                        disabled={currentUserType !== 0}
                      >
                        <Icon icon="material-symbols:edit-sharp" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;