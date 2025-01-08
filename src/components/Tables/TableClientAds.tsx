"use client"
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "@/api";
import Select from "react-select";  // Importing react-select

interface ClientAdProps {
  serialNumber: number;
  clientId: string;
  clientName: string;
  hasAdvertisement: string;
  advertisement: string | null;
}

interface AdvertisementProps {
  _id: string;
  adName: string;
}

interface ClientData {
  _id: string;
  clientId: {
    _id: string;
    name: string;
  };
}

const AllClientsAdvertisements = () => {
  const [clientAds, setClientAds] = useState<ClientAdProps[]>([]);
  const [advertisements, setAdvertisements] = useState<AdvertisementProps[]>([]);
  const [filteredAds, setFilteredAds] = useState<ClientAdProps[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filters, setFilters] = useState({
    clientName: "",
    advertisementName: "",
    hasAdvertisement: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientAdsResponse, advertisementsResponse, clientsResponse] = await Promise.all([
          api.get("/api/admin/getads", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          api.get("/api/admin/advertisements", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          api.get("/api/admin/getClients", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);

        if (
          clientAdsResponse.status !== 200 ||
          advertisementsResponse.status !== 200 ||
          clientsResponse.status !== 200
        ) {
          throw new Error("Failed to fetch data");
        }

        const clientAdsData = clientAdsResponse.data.clientAds || [];
        setClientAds(clientAdsData);
        setFilteredAds(clientAdsData);
        setAdvertisements(advertisementsResponse.data.advertisements || []);
        setClients(clientsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...clientAds];
    if (filters.clientName) {
      filtered = filtered.filter((ad) =>
        ad.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
      );
    }
    if (filters.hasAdvertisement) {
      filtered = filtered.filter(
        (ad) =>
          ad.hasAdvertisement.toLowerCase() === filters.hasAdvertisement.toLowerCase()
      );
    }
    if (filters.advertisementName) {
      filtered = filtered.filter((ad) =>
        ad.advertisement?.toLowerCase().includes(filters.advertisementName.toLowerCase())
      );
    }
    setFilteredAds(filtered);
  };

  const clearFilters = () => {
    setFilters({ clientName: "", advertisementName: "", hasAdvertisement: "" });
    setFilteredAds(clientAds);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = (index: number) => {
    setEditMode(index);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleSave = async (index: number) => {
    const updatedClientAd = filteredAds[index];
    const selectedAd = advertisements.find((ad) => ad.adName === updatedClientAd.advertisement);
    const client = clients.find((c) => c.clientId.name === updatedClientAd.clientName);

    if (!client) {
      toast.error("Client not found");
      return;
    }

    try {
      const payload =
        updatedClientAd.hasAdvertisement === "No"
          ? {
              clientId: client.clientId._id,
              advertisementId: null,
            }
          : {
              clientId: client.clientId._id,
              advertisementId: selectedAd?._id || null,
            };

      const response = await api.post("/api/admin/allocate-ad", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to save advertisement");
      }

      toast.success("Advertisement updated successfully");
      setEditMode(null);
    } catch (error) {
      console.error("Error saving advertisement:", error);
      toast.error("Failed to update advertisement");
    }
  };

  const handleAdChange = (index: number, selectedOption: any) => {
    const updatedAds = [...filteredAds];
    updatedAds[index].advertisement = selectedOption ? selectedOption.value : null;
    setFilteredAds(updatedAds);
  };

  const handleYesNoChange = (index: number, value: string) => {
    const updatedAds = [...filteredAds];
    updatedAds[index].hasAdvertisement = value;
    if (value === "No") {
      updatedAds[index].advertisement = null;
    }
    setFilteredAds(updatedAds);
  };

  const downloadAsCSV = () => {
    const csvRows = [
      ["Serial Number", "Client Name", "Has Advertisement", "Advertisement"],
      ...filteredAds.map((ad) => [
        ad.serialNumber,
        ad.clientName,
        ad.hasAdvertisement,
        ad.advertisement || "N/A",
      ]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "ClientAdvertisements.csv");
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const tableColumnHeaders = ["Serial Number", "Client Name", "Has Advertisement", "Advertisement"];
    const tableRows = filteredAds.map((ad) => [
      ad.serialNumber,
      ad.clientName,
      ad.hasAdvertisement,
      ad.advertisement || "N/A",
    ]);

    doc.text("Client Advertisements Report", 14, 16);
    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
    });
    doc.save("ClientAdvertisements.pdf");
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          name="clientName"
          value={filters.clientName}
          placeholder="Filter by Client Name"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="advertisementName"
          value={filters.advertisementName}
          placeholder="Filter by Advertisement Name"
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />
        <select
          name="hasAdvertisement"
          value={filters.hasAdvertisement}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        >
          <option value="">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
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
        <button onClick={downloadAsPDF} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
          Download PDF
        </button>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="px-4 py-4 font-medium text-black dark:text-white">Serial Number</th>
            <th className="px-4 py-4 font-medium text-black dark:text-white">Client Name</th>
            <th className="px-4 py-4 font-medium text-black dark:text-white">Advertisements</th>
            <th className="px-4 py-4 font-medium text-black dark:text-white">Advertisement Name</th>
            <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAds.map((clientAd, index) => (
            <tr key={index}>
              <td className="px-4 py-5">{clientAd.serialNumber}</td>
              <td className="px-4 py-5">{clientAd.clientName}</td>
              <td className="px-4 py-5">
                <select
                  value={clientAd.hasAdvertisement}
                  onChange={(e) => handleYesNoChange(index, e.target.value)}
                  disabled={editMode !== index}
                  className="px-3 py-2 border rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td className="px-4 py-5">
                {clientAd.hasAdvertisement === "Yes" && editMode === index ? (
                  <Select
                    value={clientAd.advertisement ? { value: clientAd.advertisement, label: clientAd.advertisement } : null}
                    onChange={(selectedOption) => handleAdChange(index, selectedOption)}
                    options={advertisements.map((ad) => ({
                      value: ad.adName,
                      label: ad.adName,
                    }))}
                    isSearchable
                    className="w-full"
                  />
                ) : (
                  clientAd.advertisement || "N/A"
                )}
              </td>
              <td className="px-4 py-5">
                {editMode === index ? (
                  <>
                    <button
                      onClick={() => handleSave(index)}
                      className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllClientsAdvertisements;