"use client";

import { useState, useEffect } from "react";
import api from "@/api";
import { Icon } from "@iconify/react";

interface Client {
  _id: string;
  clientId: {
    _id: string;
    name: string;
  };
  email: string;
  mobile: string;
  userType: number;
  status: number;
  createdAt: string;
  modifiedAt: string;
}

const ClientTable = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    status: "",
    name: "",
    createdAtFrom: "",
    createdAtTo: "",
    modifiedAtFrom: "",
    modifiedAtTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const applyFilters = () => {
    const filteredClients = clients.filter((client) => {
      const createdAt = new Date(client.createdAt).getTime();
      const modifiedAt = new Date(client.modifiedAt).getTime();
      const createdAtFrom = filters.createdAtFrom
        ? new Date(filters.createdAtFrom).getTime()
        : null;
      const createdAtTo = filters.createdAtTo
        ? new Date(filters.createdAtTo).getTime()
        : null;
      const modifiedAtFrom = filters.modifiedAtFrom
        ? new Date(filters.modifiedAtFrom).getTime()
        : null;
      const modifiedAtTo = filters.modifiedAtTo
        ? new Date(filters.modifiedAtTo).getTime()
        : null;

      return (
        (!filters.email || client.email.includes(filters.email)) &&
        (!filters.mobile || client.mobile.includes(filters.mobile)) &&
        (!filters.name || client.clientId.name.includes(filters.name)) &&
        (!filters.status ||
          client.status === Number(filters.status)) &&
        (!createdAtFrom || createdAt >= createdAtFrom) &&
        (!createdAtTo || createdAt <= createdAtTo) &&
        (!modifiedAtFrom || modifiedAt >= modifiedAtFrom) &&
        (!modifiedAtTo || modifiedAt <= modifiedAtTo)
      );
    });
    setClients(filteredClients);
  };

  const clearFilters = () => {
    setFilters({
      email: "",
      mobile: "",
      status: "",
      name: "",
      createdAtFrom: "",
      createdAtTo: "",
      modifiedAtFrom: "",
      modifiedAtTo: "",
    });
  };

  const toggleStatus = async (id: string, status: number) => {
    try {
      const response = await api.put(
        `/api/client/${id}`,
        { status: status === 1 ? 0 : 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setClients((prev) =>
          prev.map((client) =>
            client._id === id ? { ...client, status: status === 1 ? 0 : 1 } : client
          )
        );
        alert("Client status updated successfully!");
      } else {
        throw new Error("Failed to update client status.");
      }
    } catch (error) {
      console.error("Error updating client status:", error);
      alert("Error updating client status.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-4 py-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-medium text-black dark:text-white">Client Users</h2>
        <div className="flex space-x-2">
          <button
            onClick={applyFilters}
            className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="mb-4">
  {/* Filter Toggle Button */}
  <button
    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
    onClick={() => setShowFilters((prev) => !prev)}
  >
    {showFilters ? "Hide Filters" : "Show Filters"}
    <Icon
      icon={`material-symbols:${showFilters ? "expand-less" : "expand-more"}`}
      className="inline ml-2"
    />
  </button>

  {/* Filters Section */}
  {showFilters && (
    <div className="grid grid-cols-2 gap-4 mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      {/* Email Filter */}
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Email
        </label>
        <input
          type="text"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Mobile Filter */}
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Mobile
        </label>
        <input
          type="text"
          placeholder="Filter by Mobile"
          value={filters.mobile}
          onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Name Filter */}
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Name
        </label>
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      {/* Date Filters */}
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Created At From
        </label>
        <input
          type="date"
          value={filters.createdAtFrom}
          onChange={(e) => setFilters({ ...filters, createdAtFrom: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Created At To
        </label>
        <input
          type="date"
          value={filters.createdAtTo}
          onChange={(e) => setFilters({ ...filters, createdAtTo: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Modified At From
        </label>
        <input
          type="date"
          value={filters.modifiedAtFrom}
          onChange={(e) => setFilters({ ...filters, modifiedAtFrom: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-black dark:text-white">
          Modified At To
        </label>
        <input
          type="date"
          value={filters.modifiedAtTo}
          onChange={(e) => setFilters({ ...filters, modifiedAtTo: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex justify-end space-x-2">
        <button
          onClick={applyFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )}
</div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-2 font-medium text-black dark:text-white">Name</th>
              <th className="px-4 py-2 font-medium text-black dark:text-white">Email</th>
              <th className="px-4 py-2 font-medium text-black dark:text-white">Mobile</th>
              <th className="px-4 py-2 font-medium text-black dark:text-white">Status</th>
              <th className="px-4 py-2 font-medium text-black dark:text-white">Created At</th>
              <th className="px-4 py-2 font-medium text-black dark:text-white">Modified At</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td className="px-4 py-2">{client.clientId.name}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{client.mobile}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleStatus(client._id, client.status)}
                    className={`px-2 py-1 rounded-md ${
                      client.status === 1 ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {client.status === 1 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-2">{new Date(client.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(client.modifiedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;