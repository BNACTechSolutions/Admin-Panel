"use client"
import React, { useEffect, useState } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FileDropZone from "../FormElements/FileDropZone";
import { useRouter } from "next/navigation";
import api from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Custom Button Component
const Button: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, variant = 'primary', className = '', children }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 disabled:bg-opacity-50",
    outline: "border border-stroke text-black dark:text-white hover:bg-gray-100 dark:hover:bg-meta-4"
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

// Modal Component from your provided code
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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
    title: '',
    description: ''
  });
  const [landingImage, setLandingImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditLanding, setIsEditLanding] = useState<boolean>(false);
  const [translations, setTranslations] = useState<TranslationProps[]>([]);
  const [landingISL, setLandingISL] = useState<File | null>(null);

  const router = useRouter();


  const constructTranslationsJSON = (translations: TranslationProps[]): TranslationJSON => {
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
          description: response.data.description
        });
        setLandingImage(response.data.displayImage);
        setTranslations(
          response.data.translations.map((t: TranslationProps) => ({
            ...t,
            isModified: false,
          }))
        );
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
    value: string
  ) => {
    setTranslations(
      translations.map((item, i) =>
        i === index
          ? { ...item, [field]: value, isModified: true }
          : item
      )
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

  return (
    <div className="mx-auto max-w-270">
      <ToastContainer />
      <Breadcrumb pageName="Landing Management" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-black dark:text-white">
              Landing Information
            </h3>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline"
            >
              Update Main Content
            </Button>
          </div>
        </div>

        <div className="p-7">
          {/* Translations Section */}
          {translations.map((translation, index) => (
            <div key={index} className="mb-5.5">
              <div className="mb-4">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title ({translation.language})
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  value={translation.title}
                  onChange={(e) => handleTranslationUpdate(index, "title", e.target.value)}
                />
              </div>
              
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description ({translation.language})
                </label>
                <textarea
                  className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  rows={4}
                  value={translation.description}
                  onChange={(e) => handleTranslationUpdate(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* File Upload Sections */}
          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Landing Image
            </label>
            <FileDropZone onFileUpload={(file: File) => setLandingImage(file)} />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              ISL Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setLandingISL(e.target.files[0]);
                }
              }}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={updateTranslations}
              disabled={loading}
              className="w-1/4"
            >
              {loading ? "Updating..." : "Save Changes"}
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
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={mainContent.title}
              onChange={(e) => setMainContent(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Description
            </label>
            <textarea
              className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              rows={4}
              value={mainContent.description}
              onChange={(e) => setMainContent(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={updateMainContent}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Landing;