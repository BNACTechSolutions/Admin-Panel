"use client";

import { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api"; // Replace with your API instance

const AddAdvertiser = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  const validateInputs = () => {
    const errors: any = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format.";
    if (!mobile.trim()) errors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(mobile))
      errors.mobile = "Mobile number must be 10 digits.";
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Session expired, kindly re-login", {
          position: "top-right",
          autoClose: 5000,
          transition: Bounce,
        });
        return;
      }

      await api.post(
        "/api/admin/add-advertiser",
        { name, email, mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Advertiser added successfully!", {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });

      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add advertiser.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
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
        <h3 className="font-medium text-black mb-4">Add Advertiser</h3>
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border bg-gray-50 py-2 px-3"
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name}</div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border bg-gray-50 py-2 px-3"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full rounded border bg-gray-50 py-2 px-3"
          />
          {errors.mobile && (
            <div className="text-red-500 text-sm">{errors.mobile}</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Add Advertiser
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

export default AddAdvertiser;