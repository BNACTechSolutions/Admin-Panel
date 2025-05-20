"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs_client";
import FileDropZone from "../FormElements/FileDropZone";
import { useRouter } from "next/navigation";
import api from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react/dist/iconify.js";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface TranslationProps {
  language: string;
  title: string;
  description: string;
  isModified: boolean;
  audioUrls: {
    title: string;
    description: string;
  };
}

interface TranslationJSON {
  [language: string]: {
    title: string;
    description: string;
  };
}

interface MainContentProps {
  title: string;
  description: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              ISL Video
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="relative aspect-video w-full">
            <video controls className="h-full w-full rounded-lg" src={videoUrl}>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};


const Button: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline";
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, variant = "primary", className = "", children }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 disabled:bg-opacity-50",
    outline:
      "border border-stroke text-black dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mainContent, setMainContent] = useState<MainContentProps>({
    title: "",
    description: "",
  });
  const [landingTitle, setLandingTitle] = useState<string>("");
  const [landingDescription, setLandingDescription] = useState<string>("");
  const [landingImage, setLandingImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditLanding, setIsEditLanding] = useState<boolean>(false);
  const [translations, setTranslations] = useState<TranslationProps[]>([]);
  const [landingISL, setLandingISL] = useState<File | null>(null);
  const [landingImageUrl, setLandingImageUrl] = useState<string | null>("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [islVideoUrl, setIslVideoUrl] = useState<string>("");

  const router = useRouter();

  const constructTranslationsJSON = (
    translations: TranslationProps[],
  ): TranslationJSON => {
    return translations.reduce((acc: TranslationJSON, translation) => {
      if (translation.isModified) {
        acc[translation.language] = {
          title: translation.title || "",
          description: translation.description || "",
        };
      }
      return acc;
    }, {});
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
          headers: { Authorization: `Bearer ${token}` },
        });

        setMainContent({
          title: response.data.title,
          description: response.data.description,
        });
        setLandingImageUrl(response.data.displayImage);
        setTranslations(
          response.data.translations.map((t: TranslationProps) => ({
            ...t,
            isModified: false,
          })),
        );
        setIslVideoUrl(response.data.islVideo);
      } catch (error: any) {
        console.error("Error fetching landing details:", error);
        toast.error("Failed to fetch landing details");
      }
    };

    if (userData?.code) {
      setIsEditLanding(true);
      fetchLandingDetails(userData.code);
    }

    if (userType !== "0") {
      router.push("/auth/signin");
    }
  }, [router]);

  const handleTranslationUpdate = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setTranslations(
      translations.map((item, i) =>
        i === index ? { ...item, [field]: value, isModified: true } : item,
      ),
    );
  };

  const updateMainContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");

      await api.put(`/api/landing/edit`, mainContent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Main content updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update main content");
    } finally {
      setLoading(false);
    }
  };

  const updateTranslations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");

      const formData = new FormData();
      const translationsJSON = constructTranslationsJSON(translations);

      if (Object.keys(translationsJSON).length > 0) {
        formData.append("translations", JSON.stringify(translationsJSON));
      }

      if (landingImage) {
        formData.append("displayImage", landingImage);
      }

      if (landingISL) {
        formData.append("islVideo", landingISL);
      }

      await api.put("/api/landing/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Translations updated successfully");
    } catch (error) {
      toast.error("Failed to update translations");
    } finally {
      setLoading(false);
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
      <ToastContainer />
      <Breadcrumb pageName="Landing Management" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-black dark:text-white">
              {isEditLanding ? "Update Landing" : "Landing Information"}
            </h3>
            <Button onClick={() => setIsModalOpen(true)} variant="outline">
              Update Main Content
            </Button>
          </div>
        </div>

        <div className="p-7">
          {!isEditLanding && (
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
          {!isEditLanding && (
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

          {/* Translations Section */}
          {isEditLanding &&
            translations.map((translation, index) => (
              <div key={index} className="mb-5.5">
                <div className="mb-4">
                  <label className="mb-3 block justify-center text-sm font-medium text-black dark:text-white">
                    Title ({translation.language})
                    {translation?.audioUrls?.title && (
                      <button
                        className="rounded-full p-2 transition-colors hover:bg-amber-50"
                        onClick={() => {
                          const audio = new Audio(translation.audioUrls.title);
                          audio.play();
                        }}
                      >
                        <Icon
                          icon="mingcute:volume-line"
                          width="24"
                          height="24"
                        />
                      </button>
                    )}
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="text"
                    value={translation.title}
                    onChange={(e) =>
                      handleTranslationUpdate(index, "title", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description ({translation.language})
                    {translation?.audioUrls?.description && (
                      <button
                        className="rounded-full p-2 transition-colors hover:bg-amber-50"
                        onClick={() => {
                          const audio = new Audio(
                            translation.audioUrls.description,
                          );
                          audio.play();
                        }}
                      >
                        <Icon
                          icon="mingcute:volume-line"
                          width="24"
                          height="24"
                        />
                      </button>
                    )}
                  </label>
                  <textarea
                    className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    rows={4}
                    value={translation.description}
                    onChange={(e) =>
                      handleTranslationUpdate(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            ))}

          {/* File Upload Sections */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Landing Image
            </label>
            {landingImageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={landingImageUrl}
                  alt="Current landing image"
                  className="max-w-xs rounded-lg border border-stroke shadow-sm"
                />
              </div>
            )}
            <FileDropZone
              onFileUpload={(file: File) => {
                setLandingImage(file);
                // Create a temporary URL for preview
                const previewUrl = URL.createObjectURL(file);
              }}
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              ISL Video
            </label>
            <div className="space-y-4">
              {islVideoUrl && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg border border-stroke bg-gray px-4 py-2 text-black transition-colors hover:bg-gray-100 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-90"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Play ISL Video
                  </button>
                  <span className="text-sm text-gray-500">
                    Current video loaded
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setLandingISL(e.target.files[0]);
                    // Create a temporary URL for preview
                    const previewUrl = URL.createObjectURL(e.target.files[0]);
                    setIslVideoUrl(previewUrl);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Add VideoModal */}
          <VideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoUrl={islVideoUrl}
          />

          <div className="flex justify-end">
            <Button
              onClick={isEditLanding ? updateTranslations : uploadLanding}
              disabled={loading}
              className="w-1/4"
            >
              {isEditLanding
                ? loading
                  ? "Updating Translations..."
                  : "Update Translations"
                : loading
                  ? "Uploading..."
                  : "Upload Landing"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Main Content"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={mainContent.title}
              onChange={(e) =>
                setMainContent((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              rows={4}
              value={mainContent.description}
              onChange={(e) =>
                setMainContent((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateMainContent} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Landing;
