"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

const AdvertisementTable = () => {
  const [clientAds, setClientAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchClientAds = async () => {
      try {
        const response = await api.get("http://localhost:8000/api/admin/getads", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch client ads");
        }

        setClientAds(response.data.clientAds);
      } catch (error) {
        console.error("Error fetching client ads:", error);
        toast.error("Failed to load client advertisements");
      }
    };

    fetchClientAds();
  }, []);

  const handleAdvertisementChange = async (clientId: string, advertisementId: string) => {
    try {
      const response = await api.post(
        "/api/admin/allocate-ad",
        {
          clientId,
          advertisementId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Advertisement allocated successfully");
        // Update the client advertisements after allocation
        setClientAds((prevClientAds) =>
          prevClientAds.map((clientAd) =>
            clientAd.clientName === response.data.updatedClient.clientName
              ? response.data.updatedClient
              : clientAd
          )
        );
      }
    } catch (error) {
      console.error("Error allocating advertisement:", error);
      toast.error("Failed to allocate advertisement");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Client Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Advertisement
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Has Advertisement?</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {clientAds.length > 0 ? (
              clientAds.map((clientAd) => (
                <tr key={clientAd.serialNumber}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{clientAd.clientName}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{clientAd.advertisement}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{clientAd.hasAdvertisement}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <button
                      onClick={() => handleAdvertisementChange(clientAd.clientName, "new-ad-id")}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Change Advertisement
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No client advertisements available
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
