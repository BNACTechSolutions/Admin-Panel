"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported
import api from "@/api";

const AddAdmin = () => {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userMobile, setUserMobile] = useState<string>("");
  const [userType, setUserType] = useState<string>("2"); // Default to Manager
  const [status, setStatus] = useState<number>(1); // Default status
  const [errors, setErrors] = useState<any>({}); // Error state for input validation

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/auth/admin/signin");
    }
  }, [router]);

  const validateInputs = () => {
    const errors: any = {};
    if (!userName.trim()) errors.userName = "Name is required.";
    if (!userEmail.trim()) errors.userEmail = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail))
      errors.userEmail = "Invalid email format.";
    if (!userMobile.trim()) errors.userMobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(userMobile))
      errors.userMobile = "Mobile number must be 10 digits.";
    return errors;
  };

  const addUser = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userData = {
      name: userName,
      mobile: userMobile,
      email: userEmail,
      user_type: parseInt(userType),
      status,
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Session expired, kindly re-login", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }

      await api.post("/api/admin/add", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      setUserName("");
      setUserEmail("");
      setUserMobile("");
      setUserType("2"); // Reset to default Manager
      setErrors({});
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add user.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Breadcrumb pageName="Add Admin" />

      <div>
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Admin Information
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="userName"
                  >
                    Name
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="userName"
                    placeholder="Enter Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  {errors.userName && (
                    <div className="mt-1 text-red-500 text-sm">
                      {errors.userName}
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="userEmail"
                  >
                    Email
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="email"
                    id="userEmail"
                    placeholder="Enter Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  {errors.userEmail && (
                    <div className="mt-1 text-red-500 text-sm">
                      {errors.userEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="userMobile"
                  >
                    Mobile Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="userMobile"
                    placeholder="Enter Mobile Number"
                    value={userMobile}
                    onChange={(e) => setUserMobile(e.target.value)}
                  />
                  {errors.userMobile && (
                    <div className="mt-1 text-red-500 text-sm">
                      {errors.userMobile}
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="userType"
                  >
                    User Type
                  </label>
                  <select
                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                  </select>
                </div>
              </div>

              <button
                className="flex h-3/4 w-1/2 justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 md:h-full"
                type="button"
                onClick={addUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;