"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

const EditAdvertisement = ({
  advertisement,
  onClose,
  onUpdate, // Added the onUpdate prop here
}: {
  advertisement: any;
  onClose: () => void;
  onUpdate: (updatedAd: any) => void; // This prop will be used to update the parent state
}) => {
  const [adName, setAdName] = useState<string>(advertisement.adName);
  const [adImage, setAdImage] = useState<File | null>(null);
  const [advertiserId, setAdvertiserId] = useState<string>(advertisement.advertiserId._id);
  const [advertisers, setAdvertisers] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string>(advertisement.adImage || "");
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
    if (!advertiserId) errors.advertiserId = "Please select an advertiser.";
    return errors;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("adName", adName);
    formData.append("advertiserId", advertiserId);

    // Only append the new image if it has been changed
    if (adImage) {
      formData.append("adImage", adImage as Blob);
    }

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

      const response = await api.put(`/api/admin/advertisements/${advertisement._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Advertisement updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          transition: Bounce,
        });

        // Close the modal or redirect if needed
        onUpdate(response.data.updatedAdvertisement); // Call onUpdate with the updated ad
        onClose(); // Close the modal
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update advertisement.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });
    }
  };

  const handleCancel = () => {
    onClose(); // Calls onClose here as well
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
        <h3 className="font-medium text-black mb-4">Edit Advertisement</h3>

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
          <label className="block text-sm font-medium mb-2">Current Image</label>
          <div className="mb-3">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Advertisement"
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div>No image available</div>
            )}
          </div>

          <label className="block text-sm font-medium mb-2">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Update Advertisement
          </button>
          <button
            onClick={handleCancel} // Now calls onClose here as well
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdvertisement;