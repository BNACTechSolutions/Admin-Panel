"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

const AddAdvertisement = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [clients, setClients] = useState<string[]>([]); // Store selected client IDs
  const [image, setImage] = useState<File | null>(null);
  const [allClients, setAllClients] = useState<any[]>([]); // Store list of all clients
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/admin/signin");
        }
        const response = await api.get("api/admin/getClients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllClients(response.data || []);
      } catch (error) {
        toast.error("Error fetching clients list.", {
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

    fetchClients();
  }, [router]);

  const validateInputs = () => {
    const errors: any = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format.";
    if (!mobile.trim()) errors.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(mobile)) errors.mobile = "Mobile number must be 10 digits.";
    if (clients.length === 0) errors.clients = "At least one client must be selected.";
    if (!image) errors.image = "Image is required.";
    return errors;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleClientSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clientId = e.target.value; // Use clientId
    setClients((prevClients) =>
      e.target.checked
        ? [...prevClients, clientId] // Add clientId if checked
        : prevClients.filter((id) => id !== clientId) // Remove clientId if unchecked
    );
  };

  const handleSubmit = async () => {
    // Validate inputs
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);

    // Serialize `clients` as a JSON string
    if (clients.length > 0) {
      formData.append("clients", JSON.stringify(clients)); // Correct format
    }

    // Append image if provided
    if (image) formData.append("adImage", image);

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

      // Make API request
      await api.post("/api/admin/add-advertisement-user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success toast
      toast.success("Advertisement added successfully!", {
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

      // Reset form state
      setName("");
      setEmail("");
      setMobile("");
      setClients([]);
      setImage(null);
      setErrors({});
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add advertisement.";
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
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Add Advertisement</h3>
          </div>
          <div className="p-7">
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="mt-1 text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="mt-1 text-red-500 text-sm">{errors.email}</div>}
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="mobile">
                  Mobile Number
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  id="mobile"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {errors.mobile && <div className="mt-1 text-red-500 text-sm">{errors.mobile}</div>}
              </div>
            </div>

            {/* Clients Checkboxes Section */}
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="clients">
                  Clients
                </label>
                <div>
                  {allClients.map((client) => (
                    <div key={client._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`client-${client.clientId}`}
                        value={client.clientId} // Use clientId
                        checked={clients.includes(client.clientId)}
                        onChange={handleClientSelection}
                        className="mr-2"
                      />
                      <label htmlFor={`client-${client.clientId}`} className="text-sm">
                        {client.name || client.email}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.clients && <div className="mt-1 text-red-500 text-sm">{errors.clients}</div>}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="adImage">
                Upload Image
              </label>
              <input
                className="w-full"
                type="file"
                id="adImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && <div className="mt-1 text-red-500 text-sm">{errors.image}</div>}
            </div>

            <button
              className="flex w-full justify-center rounded bg-primary py-3 font-medium text-gray hover:shadow-1"
              onClick={handleSubmit}
            >
              Add Advertisement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertisement;
