"use client";

import { useState, useEffect } from "react";
import api from "@/api";
import { Icon } from "@iconify/react";

interface Client {
  _id: string;
  name: string;
  clientId: {
    _id: string;
    name: string;
  };
  email: string;
  mobile: string;
  maximumDisplays: number;
  audio: number;
  isl: number;
  userType: number;
  languages?: Languages;
  status: number;
  createdAt: string;
  modifiedAt: string;
}

interface Languages {
  [key: string]: number;
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
  const [showModal, setShowModal] = useState(false);
  const [clientIdentity, setClientIdentity] = useState("");
  const [editClient, setEditClient] = useState<Client | null>(null);

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

  const openEditModal = async (client: Client) => {
    try {
      setClientIdentity(client.clientId._id)
      const response = await api.get(`/api/client/getclient/${client.clientId._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        setEditClient(response.data);
        setShowModal(true);
      } else {
        throw new Error("Failed to fetch client details");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  const closeModal = () => {
    setEditClient(null);
    setShowModal(false);
  };

  const handleSaveEdit = async () => {
    if (editClient) {
      try {
        const response = await api.put(`/api/client/${clientIdentity}`, editClient, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.status === 200) {
          setClients((prev) =>
            prev.map((client) =>
              client._id === editClient._id ? editClient : client
            )
          );
          closeModal();
          alert("Client details updated successfully!");
        } else {
          throw new Error("Failed to update client details.");
        }
      } catch (error) {
        console.error("Error updating client:", error);
        alert("Error updating client details.");
      }
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Mobile</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Modified At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="border-b dark:border-gray-600">
                <td className="px-6 py-4">{client.clientId.name}</td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4">{client.mobile}</td>
                <td className="px-6 py-4">
                  <span
                    className={`${
                      client.status === 1 ? "bg-green-500" : "bg-red-500"
                    } px-3 py-1 rounded-full text-white`}
                  >
                    {client.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">{client.createdAt}</td>
                <td className="px-6 py-4">{client.modifiedAt}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(client)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={editClient?.name || ""}
              onChange={(e) =>
                setEditClient({
                  ...editClient!,
                  clientId: { ...editClient!.clientId, name: e.target.value },
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={editClient?.email || ""}
              onChange={(e) =>
                setEditClient({ ...editClient!, email: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="block mb-2">Mobile</label>
            <input
              type="text"
              value={editClient?.mobile || ""}
              onChange={(e) =>
                setEditClient({ ...editClient!, mobile: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Maximum Displays */}
          <div className="mb-4">
            <label className="block mb-2">Maximum Displays</label>
            <input
              type="number"
              value={editClient?.maximumDisplays || ""}
              onChange={(e) =>
                setEditClient({
                  ...editClient!,
                  maximumDisplays: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Audio */}
          <div className="mb-4">
            <label className="block mb-2">Audio</label>
            <input
              type="checkbox"
              checked={editClient?.audio === 1}
              onChange={(e) =>
                setEditClient({
                  ...editClient!,
                  audio: e.target.checked ? 1 : 0,
                })
              }
              className="p-2"
            />
          </div>

          {/* ISL */}
          <div className="mb-4">
            <label className="block mb-2">ISL</label>
            <input
              type="checkbox"
              checked={editClient?.isl === 1}
              onChange={(e) =>
                setEditClient({
                  ...editClient!,
                  isl: e.target.checked ? 1 : 0,
                })
              }
              className="p-2"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select
              value={editClient?.status || 0}
              onChange={(e) =>
                setEditClient({ ...editClient!, status: Number(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value={0}>Inactive</option>
              <option value={1}>Active</option>
            </select>
          </div>

          {/* Languages */}
          <div className="mb-4 col-span-1 sm:col-span-2 lg:col-span-3 overflow-auto max-h-60">
            <label className="block mb-2">Languages</label>
            <div className="grid grid-cols-4 gap-4">
            {[
              'english', 'hindi', 'odia', 'bengali', 'telugu', 'tamil', 'malayalam',
              'kannada', 'marathi', 'gujarati', 'marwadi', 'punjabi', 'assamese',
              'urdu', 'sanskrit', 'spanish', 'french', 'german', 'mandarin', 'japanese',
              'arabic', 'russian', 'portuguese', 'italian', 'korean', 'thai',
            ].map((language) => (
              <div key={language} className="flex items-center">
                <input
                  type="checkbox"
                  checked={editClient?.languages?.[language] === 1} // Check if the language is enabled
                  onChange={(e) => {
                    // Ensure editClient?.languages is an object
                    const newLanguages = { ...editClient?.languages };

                    if (e.target.checked) {
                      newLanguages[language] = 1; // Enable the language
                    } else {
                      newLanguages[language] = 0; // Disable the language (set to 0 instead of deleting)
                    }

                    setEditClient({
                      ...editClient!,
                      languages: newLanguages, // Update the languages state
                    });
                  }}
                  className="mr-2"
                />
                <label>{language.charAt(0).toUpperCase() + language.slice(1)}</label>
              </div>
            ))}
          </div>;
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSaveEdit}
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default ClientTable;