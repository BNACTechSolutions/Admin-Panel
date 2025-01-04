"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import api from "@/api";
import {jwtDecode} from 'jwt-decode';

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
  const [currentUserType, setCurrentUserType] = useState<number | null>(null);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<number>(1); // Default: Active
  const router = useRouter();

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

  const editAdmin = async (id: string) => {
    if (currentUserType === 0) {
      try {
        const response = await api.put(
          `api/admin/${id}`,
          { status: newStatus }, // Sending status data
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Admin status updated successfully!");
          setAdmins((prev) =>
            prev.map((admin) =>
              admin._id === id ? { ...admin, status: newStatus } : admin
            )
          );
          setEditingAdminId(null); // Reset editing state
        } else {
          throw new Error("Failed to update admin status.");
        }
      } catch (error) {
        console.error("Error updating admin status:", error);
        alert("Error updating admin status.");
      }
    } else {
      alert("You do not have permission to edit admin details.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-medium text-black dark:text-white">Admin Users</h2>
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
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {admin.name}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {admin.email}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {admin.mobile}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {admin.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  <div className="flex items-center space-x-3.5">
                    {editingAdminId === admin._id ? (
                      <div className="flex items-center">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(Number(e.target.value))}
                          className="border border-gray-300 p-1 rounded-md"
                        >
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                        <button
                          className="ml-2 text-green-500 hover:underline"
                          onClick={() => editAdmin(admin._id)}
                        >
                          Save
                        </button>
                        <button
                          className="ml-2 text-red-500 hover:underline"
                          onClick={() => setEditingAdminId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setEditingAdminId(admin._id)}
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