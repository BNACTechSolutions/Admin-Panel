"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { toast, ToastContainer } from "react-toastify";
import api from "@/api/index";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Adjust the import path to your API utility

  const handlePasswordChange = async () => {
    const userData = localStorage.getItem("userData");
    const email = userData ? JSON.parse(userData).email : null;

    if (!email) {
      toast.error("User not logged in!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post("/admin/change-password", {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data.is_success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred. Please try again later.",
      );
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer
        position="top-right"
        autoClose={5000} // 5 seconds auto close
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Change Password
            </h3>
          </div>
          <div className="p-7">
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="oldPassword"
              >
                Old Password
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                id="oldPassword"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                id="newPassword"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                type="submit"
                onClick={handlePasswordChange}
              >
                Confirm Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
