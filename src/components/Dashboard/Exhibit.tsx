"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FileDropZone from "../FormElements/FileDropZone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ExhibitUpload = () => {
  const [exhibitTitle, setExhibitTitle] = useState<string>("");
  const [exhibitImage, setExhibitImage] = useState<File | null>(null);
  const [exhibitDescription, setExhibitDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]); // State to store multiple images
  const [loading, setLoading] = useState<boolean>(false);
  const [exhibitISL, setExhibitISL] = useState<File | null>(null);

  const router = useRouter();
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "0") {
      // Redirect to /auth/signin if userType is invalid
      router.push("/auth/signin");
    }
  }, [router]);

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadExhibit = async () => {
    setLoading(true);
    if (!exhibitTitle) {
      toast.error("Exhibit title is required", { position: "top-right" });
      setLoading(false);
      return;
    }
    if (!exhibitDescription) {
      toast.error("Exhibit description is required", { position: "top-right" });
      setLoading(false);
      return;
    }
    if(!exhibitImage) {
      toast.error("Exhibit image is required", { position: "top-right" });
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("title", exhibitTitle);
    if (exhibitImage) {
      formData.append("titleImage", exhibitImage);
    } else {
      toast.error("No image selected", { position: "top-right" });
    }
    formData.append("description", exhibitDescription);
    
    if (exhibitISL) {
      formData.append("islVideo", exhibitISL);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Authentication token is missing.");
        return;
      }
      const response = await api.post("/api/exhibit/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Exhibit Uploaded!", {
        position: "top-right",
      });
      setLoading(false);
    } catch (error: any) {
      toast.error(`Exhibit Upload failed ${error}`, {
        position: "top-right",
      });
      if (error.response) {
        toast.error("Exhibit upload failed.", {
          position: "top-right",
        });
        
        console.error("Exhibit upload failed:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);

      } else {
        console.error("An error occurred during upload:", error.message);
      }
      setLoading(false);
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
      <Breadcrumb pageName="Exhibit Upload" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exhibit Information
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Exhibit Title
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Exhibit Title"
                        value={exhibitTitle}
                        onChange={(e) => setExhibitTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 ">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white "
                    htmlFor="username"
                  >
                    Exhibit Image
                  </label>
                  <FileDropZone
                    onFileUpload={(file: File) => setExhibitImage(file)}
                  />
                </div>
              </div>

              <div className="mb-5.5">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="Username"
                >
                  Description
                </label>
                <div className="relative">
                  <span className="absolute left-4.5 top-4 ">
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 4.99301C17.5024 4.81774 17.6005 4.5808 17.6005 4.332C17.6005 4.08319 17.5024 3.84625 17.3271 3.67098C17.1518 3.49571 16.913 3.39884 16.6664 3.39884L10.833 3.39884C10.3737 3.39884 9.99967 3.77289 9.99967 4.23211C9.99967 4.69133 10.3737 5.06442 10.833 5.06442H16.6664C16.9187 5.06442 17.1507 4.96659 17.3223 4.79899C17.4939 4.63139 17.5916 4.39935 17.5916 4.14948C17.5916 3.8996 17.4939 3.66756 17.3223 3.49996C17.1507 3.33236 16.9187 3.23453 16.6664 3.23453L8.25216 3.23453C8.01686 3.23453 7.79808 3.29784 7.61771 3.47821C7.43734 3.65857 7.37403 3.87734 7.37403 4.11374C7.37403 4.35014 7.43734 4.56891 7.61771 4.74928L15.1462 12.2778L16.1885 10.9514L16.6664 2.39884Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                  <textarea
                    className="w-full rounded-lg border border-stroke bg-gray py-3 pl-7 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="bio"
                    id="bio"
                    rows={4}
                    placeholder="Add a description"
                    value={exhibitDescription}
                    onChange={(e) => setExhibitDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="videoUpload"
                  >
                    Upload ISL
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={ (e) => {
                      if(e.target.files && e.target.files.length > 0){
                        setExhibitISL(e.target.files[0]);
                      }
                    }}
                    className="w-full"
                  />
                </div>

              {/* Multi-image upload button */}
              <div className="mb-5.5">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="multiImageUpload"
                >
                  Upload Additional Images
                </label>
                <input
                  type="file"
                  id="multiImageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleMultiImageUpload}
                  className="w-full rounded-lg border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Display selected images */}
              <div className="flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="h-32 w-32 rounded-sm bg-gray-100 p-2"
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                      className="h-full w-full rounded-sm object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={uploadExhibit}
                className="mt-5 w-full rounded bg-primary px-5 py-3.5 text-center text-white"
              >
                {loading ? "Uploading..." : "Upload Exhibit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ExhibitUpload.getLayout = (page: any) => <DefaultLayout>{page}</DefaultLayout>;

export default ExhibitUpload;
