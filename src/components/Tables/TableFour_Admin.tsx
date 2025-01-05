"use client";

import { useState, useEffect } from "react";
import api from "@/api";

interface Client {
  _id: string;
  clientId: string;
  email: string;
  mobile: string;
  userType: number;
  status: number;
  createdAt: string;
  modifiedAt: string;
}

const ClientTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sortField, setSortField] = useState<keyof Client>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("api/admin/getClients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch clients");
        }
        const data = response.data;
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleSort = (field: keyof Client) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedClients = [...clients].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setClients(sortedClients);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-medium text-black dark:text-white">Client Users</h2>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("mobile")}
              >
                Mobile {sortField === "mobile" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created At {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"
                onClick={() => handleSort("modifiedAt")}
              >
                Modified At {sortField === "modifiedAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {client.email}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {client.mobile}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {client.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {new Date(client.createdAt).toLocaleString()}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 text-black dark:text-white">
                  {new Date(client.modifiedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
