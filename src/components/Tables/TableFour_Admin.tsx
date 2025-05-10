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

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

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
      
      {showModal && (
      <>
        {/* Backdrop with high z-index */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-[9999]"
          onClick={closeModal}
        ></div>
        
        {/* Modal container */}
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
          {/* Modal content with responsive sizing */}
          <div 
            className="relative w-full max-w-5xl bg-white dark:bg-boxdark rounded-xl shadow-2xl"
            style={{
              maxHeight: "90vh",
              marginLeft: "auto",
              marginRight: "auto",
              width: "calc(100% - 2rem)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - sticky */}
            <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark px-6 py-4 sticky top-0 bg-white dark:bg-boxdark z-10">
              <h2 className="text-xl font-semibold text-black dark:text-white">Edit Client</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body - scrollable content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)" }}>
              <form>
                <div className="grid grid-cols-12 gap-4">
                  {/* Main client information - spans 8 columns */}
                  <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="mb-3">
                      <label className="block mb-1 text-sm font-medium text-black dark:text-white">Name</label>
                      <input
                        type="text"
                        value={editClient?.name || ""}
                        onChange={(e) =>
                          setEditClient({
                            ...editClient!,
                            clientId: { ...editClient!.clientId, name: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-stroke dark:border-strokedark rounded-lg"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="block mb-1 text-sm font-medium text-black dark:text-white">Email</label>
                      <input
                        type="email"
                        value={editClient?.email || ""}
                        onChange={(e) =>
                          setEditClient({ ...editClient!, email: e.target.value })
                        }
                        className="w-full p-2 border border-stroke dark:border-strokedark rounded-lg"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="mb-3">
                      <label className="block mb-1 text-sm font-medium text-black dark:text-white">Mobile</label>
                      <input
                        type="text"
                        value={editClient?.mobile || ""}
                        onChange={(e) =>
                          setEditClient({ ...editClient!, mobile: e.target.value })
                        }
                        className="w-full p-2 border border-stroke dark:border-strokedark rounded-lg"
                      />
                    </div>

                    {/* Small controls in a row */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Maximum Displays */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-black dark:text-white">Max Displays</label>
                        <input
                          type="number"
                          value={editClient?.maximumDisplays || ""}
                          onChange={(e) =>
                            setEditClient({
                              ...editClient!,
                              maximumDisplays: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border border-stroke dark:border-strokedark rounded-lg"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-black dark:text-white">Status</label>
                        <select
                          value={editClient?.status || 0}
                          onChange={(e) =>
                            setEditClient({ ...editClient!, status: Number(e.target.value) })
                          }
                          className="w-full p-2 border border-stroke dark:border-strokedark rounded-lg"
                        >
                          <option value={0}>Inactive</option>
                          <option value={1}>Active</option>
                        </select>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="col-span-1 sm:col-span-2 mb-3">
                      <h3 className="block mb-2 text-sm font-medium text-black dark:text-white">Languages</h3>
                      <div className="p-3 border border-stroke dark:border-strokedark rounded-lg bg-gray-50 dark:bg-gray-800 overflow-y-auto" style={{ maxHeight: "180px" }}>
                        <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                          {[
                            'english', 'hindi', 'odia', 'bengali', 'telugu', 'tamil', 'malayalam',
                            'kannada', 'marathi', 'gujarati', 'marwadi', 'punjabi', 'assamese',
                            'urdu', 'sanskrit', 'spanish', 'french', 'german', 'mandarin', 'japanese',
                            'arabic', 'russian', 'portuguese', 'italian', 'korean', 'thai',
                          ].map((language) => (
                            <div key={language} className="flex items-center">
                              <input
                                id={`lang-${language}`}
                                type="checkbox"
                                checked={editClient?.languages?.[language] === 1}
                                onChange={(e) => {
                                  const newLanguages = { ...editClient?.languages };
                                  newLanguages[language] = e.target.checked ? 1 : 0;
                                  setEditClient({
                                    ...editClient!,
                                    languages: newLanguages,
                                  });
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={`lang-${language}`} className="ml-2 text-xs text-black dark:text-white">
                                {language.charAt(0).toUpperCase() + language.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right sidebar for features */}
                  <div className="col-span-12 md:col-span-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-stroke dark:border-strokedark rounded-lg">
                      <h3 className="text-sm font-medium mb-3 text-black dark:text-white">Client Features</h3>
                      
                      <div className="space-y-3">
                        {/* Audio */}
                        <div className="flex items-center p-3 bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                          <input
                            id="audio-checkbox"
                            type="checkbox"
                            checked={editClient?.audio === 1}
                            onChange={(e) =>
                              setEditClient({
                                ...editClient!,
                                audio: e.target.checked ? 1 : 0,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <label htmlFor="audio-checkbox" className="font-medium text-sm text-black dark:text-white">Audio</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Enable audio features for this client</p>
                          </div>
                        </div>
                        
                        {/* ISL */}
                        <div className="flex items-center p-3 bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                          <input
                            id="isl-checkbox"
                            type="checkbox"
                            checked={editClient?.isl === 1}
                            onChange={(e) =>
                              setEditClient({
                                ...editClient!,
                                isl: e.target.checked ? 1 : 0,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <label htmlFor="isl-checkbox" className="font-medium text-sm text-black dark:text-white">ISL</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Enable Indian Sign Language support</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Modal Footer - sticky */}
            <div className="flex justify-end space-x-2 px-6 py-4 border-t border-stroke dark:border-strokedark sticky bottom-0 bg-white dark:bg-boxdark">
              <button
                onClick={closeModal}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                type="button" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </>
    )}

    </div>
  );
};

export default ClientTable;