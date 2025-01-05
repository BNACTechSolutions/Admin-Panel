"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/api/index";
import "react-toastify/dist/ReactToastify.css";

const SetupPassword = () => {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter(); // For redirection
  const [email, setEmail] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract email and tempPassword from the URL path
    const parts = pathname.split("/"); // Example: ["", "setup-password", "sriss2003@gmail.com", "tdk97xr7"]
    if (parts.length === 4) {
      setEmail(parts[2]);
      setTempPassword(parts[3]);
    }
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      email,
      tempPassword,
      newPassword,
    };

    try {
      const response = await api.post("/api/admin/setup-password", payload);

      if (response.status === 200) {
        toast.success("Password has been set successfully!", {
          position: "top-right",
        });
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
      toast.error(error || "Error setting password!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-md">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
          Setup New Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email || ""}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tempPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Temporary Password
            </label>
            <input
              id="tempPassword"
              type="text"
              value={tempPassword || ""}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Submitting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPassword;
