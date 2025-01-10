"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FileDropZone from "../FormElements/FileDropZone";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TranslationProps = {
  language: string;
  title: string;
  description: string;
  isModified: boolean;
};

type TranslationJSON = {
  [language: string]: {
    title: string;
    description: string;
  };
};

const Landing = () => {
  const [landingTitle, setLandingTitle] = useState<string>("");
  const [landingImage, setLandingImage] = useState<File | null>(null);
  const [landingDescription, setLandingDescription] = useState<string>("");
  const [loding, setLoading] = useState<boolean>(false);
  const [isEditLanding, setIsEditLanding] = useState<boolean>(false);
  const [translations, setTranslations] = useState<TranslationProps[]>([]);
  const [landingISL, setLandingISL] = useState<File | null>(null);

  const router = useRouter();

  const constructTranslationsJSON = (translations: TranslationProps[]) => {
    const updatedTranslations = translations.reduce(
      (acc: TranslationJSON, translation) => {
        if (translation.isModified === true) {
          acc[translation.language] = {
            title: translation.title || "", // Fallback to empty string if title is missing
            description: translation.description || "", // Same for description
          };
        }
        return acc;
      },
      {} // Initial value of the accumulator
    );
  
    return updatedTranslations; // Return the final result
  };
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const fetchLandingDetails = async (code: string) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Authentication token is missing.");
          return;
        }
        const response = await api.get(`/api/landing/${code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Landing Details:", response.data);
        setLandingTitle(response.data.title);
        setLandingDescription(response.data.description);
        setLandingImage(response.data.displayImage);
        setTranslations(
          response.data.translations.map((t: TranslationProps) => ({
            ...t,
            isModified: false,
          })),
        );
      } catch (error: any) {
        console.error("An error occurred during landing fetch:", error);
        if (error.response) {
          // Server responded with a status code outside the range of 2xx
          console.error("Landing fetch failed:", error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:", error.request);
        } else {
          // Other errors
          console.error(
            "An error occurred during landing fetch:",
            error.message,
          );
        }
      }
    };

    if (userData?.code) {
      setIsEditLanding(true);
      fetchLandingDetails(userData.code);
    }
    console.log("User Type:", userType);
    if (userType !== "0") {
      // Redirect to /auth/signin if userType is invalid
      router.push("/auth/signin");
    }
  }, [router]);


  const handleTranslationUpdate = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    console.log("Updating translation:", index, field, value);
    setTranslations(
      translations.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              isModified: true,
            }
          : item,
      ),
    );
  };

  const updateLanding = async () => {
    const updatedTranslationsJSON = constructTranslationsJSON(translations);

    const formData = new FormData();

    // Append JSON data
    const modifiedTranslationsJSON = constructTranslationsJSON(translations);
      console.log(modifiedTranslationsJSON);
      if (Object.keys(modifiedTranslationsJSON).length > 0) {
        formData.append(
          "translations",
          JSON.stringify(modifiedTranslationsJSON),
        );
      }

    if (landingTitle) {
      formData.append("title", landingTitle);
    }
    if (landingImage) {
      formData.append("displayImage", landingImage);
    }
    if (landingDescription) {
      formData.append("description", landingDescription);
    }

    // Append the video file
    if (landingISL) {
      formData.append("islVideo", landingISL);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      await api.put("/api/landing/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("toast success called");
      toast.success("Landing updated successfully.", {
        position: "top-right",
        autoClose: 3000, // Ensure toast auto-closes after a certain time
      });

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "An error occurred during the update.",
        { position: "top-right" },
      );
      console.error("Error updating landing:", error);
    }
  };

  const uploadLanding = async () => {
    if (!landingImage) {
      console.error("No image selected for upload.");
      return;
    }
    if (!landingISL) {
      toast.error("Please upload ISL video", {
        position: "top-right",
      });
    }
    const formData = new FormData();
    formData.append("title", landingTitle);
    formData.append("displayImage", landingImage);
    formData.append("description", landingDescription);
    if (landingISL) {
      formData.append("islVideo", landingISL);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Authentication token is missing.");
        return;
      }

      const response = await api.post("/api/landing/setup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Landing uploaded successfully.", {
        position: "top-right",
      });

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during landing upload. Please try again.",
        { position: "top-right" },
      );
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        console.error("Landing upload failed:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Other errors
        console.error(
          "An error occurred during landing upload:",
          error.message,
        );
      }
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
      <Breadcrumb
        pageName={isEditLanding ? "Edit Landing" : "Landing Upload"}
      />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Landing Information
              </h3>
            </div>
            <div className="p-7">
            {isEditLanding && (
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Title
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Title"
                        value={landingTitle}
                        onChange={(e) => setLandingTitle(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {isEditLanding && (
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
                              d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_88_10224">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="bio"
                        id="bio"
                        rows={6}
                        placeholder="Landing page description"
                        value={landingDescription}
                        onChange={(e) => setLandingDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                
                
                <div className="w-full sm:w-1/2">
                  {isEditLanding ? (
                    translations.map((translation, index) => (
                      <div key={index} className="mb-5.5">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName"
                        >
                          Zoo Title ({translation.language})
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="Zoo Title"
                            value={translation.title}
                            onChange={(e) =>
                              handleTranslationUpdate(
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Zoo Title
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Zoo Title"
                          value={landingTitle}
                          onChange={(e) => setLandingTitle(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-1/2 ">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white "
                    htmlFor="username"
                  >
                    Landing Image
                  </label>
                  <FileDropZone
                    onFileUpload={(file: File) => setLandingImage(file)}
                  />
                </div>
              </div>

              {isEditLanding ? (
                translations.map((translation, index) => (
                  <div key={index} className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Description ({translation.language})
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
                              d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_88_10224">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="bio"
                        id="bio"
                        rows={6}
                        placeholder="Landing page description"
                        value={translation.description}
                        onChange={(e) =>
                          handleTranslationUpdate(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      ></textarea>
                    </div>
                  </div>
                ))
              ) : (
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
                            d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_88_10224">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="bio"
                      id="bio"
                      rows={6}
                      placeholder="Landing page description"
                      value={landingDescription}
                      onChange={(e) => setLandingDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}

              {isEditLanding ? (
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="videoUpload"
                  >
                    Update ISL
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setLandingISL(e.target.files[0]);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              ) : (
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
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setLandingISL(e.target.files[0]);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4.5 dark:text-white">
                {/* <button
                  className="flex w-1/2 justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="submit"
                >
                  <span className="pr-5">
                    <Icon icon="mingcute:ai-fill" />
                  </span>
                  Generate Text Description
                </button> */}

                <button
                  className="flex h-3/4 w-1/2 justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 md:h-full"
                  type="submit"
                  onClick={isEditLanding ? updateLanding : uploadLanding}
                >
                  {loding
                    ? isEditLanding
                      ? "Updating..."
                      : "Uploading..."
                    : isEditLanding
                      ? "Update"
                      : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;