"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

const AddAdvertisement = () => {
  const [adName, setAdName] = useState<string>("");
  const [adImage, setAdImage] = useState<File | null>(null);
  const [advertiserId, setAdvertiserId] = useState<string>("");
  const [advertisers, setAdvertisers] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  // Fetch advertisers on component load
  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Session expired. Please re-login.", {
            position: "top-right",
            autoClose: 5000,
            transition: Bounce,
          });
          return;
        }

        const response = await api.get("/api/admin/advertisers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdvertisers(response.data.advertisers || []);
      } catch (error) {
        toast.error("Failed to fetch advertisers.", {
          position: "top-right",
          autoClose: 5000,
          transition: Bounce,
        });
      }
    };

    fetchAdvertisers();
  }, []);

  const validateInputs = () => {
    const errors: any = {};
    if (!adName.trim()) errors.adName = "Advertisement name is required.";
    if (!adImage) errors.adImage = "Advertisement image is required.";
    if (!advertiserId) errors.advertiserId = "Please select an advertiser.";
    return errors;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAdImage(file);
  };

  const handleSubmit = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("adName", adName);
    formData.append("adImage", adImage as Blob);
    formData.append("advertiserId", advertiserId);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Session expired. Please re-login.", {
          position: "top-right",
          autoClose: 5000,
          transition: Bounce,
        });
        return;
      }

      await api.post("/api/admin/add-advertisement", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Advertisement added successfully!", {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });

      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add advertisement.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });
    }
  };

  const resetForm = () => {
    setAdName("");
    setAdImage(null);
    setAdvertiserId("");
    setErrors({});
  };

  return (
    <div className="mx-auto max-w-270">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        transition={Bounce}
      />
      <div className="rounded-sm border bg-white shadow-default p-7">
        <h3 className="font-medium text-black mb-4">Add Advertisement</h3>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2" htmlFor="adName">
            Advertisement Name
          </label>
          <input
            type="text"
            id="adName"
            placeholder="Enter Advertisement Name"
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            className="w-full rounded border bg-gray-50 py-2 px-3"
          />
          {errors.adName && (
            <div className="text-red-500 text-sm">{errors.adName}</div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Advertiser</label>
          <select
            value={advertiserId}
            onChange={(e) => setAdvertiserId(e.target.value)}
            className="w-full rounded border bg-gray-50 py-2 px-3"
          >
            <option value="">Select Advertiser</option>
            {advertisers.map((advertiser) => (
              <option key={advertiser._id} value={advertiser._id}>
                {advertiser.name}
              </option>
            ))}
          </select>
          {errors.advertiserId && (
            <div className="text-red-500 text-sm">{errors.advertiserId}</div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {errors.adImage && (
            <div className="text-red-500 text-sm">{errors.adImage}</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Add Advertisement
          </button>
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertisement;