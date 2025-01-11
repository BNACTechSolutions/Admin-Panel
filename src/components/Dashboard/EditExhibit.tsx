import React, { useEffect, useState, ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FileDropZone from "../FormElements/FileDropZone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";
import { usePathname } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

interface Translation {
  language: string;
  title?: string;
  description?: string;
  isModified?: boolean;
}

interface ExhibitData {
  title: string;
  description: string;
  translations: Translation[];
}

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

const EditExhibit: React.FC = () => {
  const [exhibitData, setExhibitData] = useState<ExhibitData | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [exhibitImage, setExhibitImage] = useState<File | null>(null);
  const [exhibitISL, setExhibitISL] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const path = usePathname();
  const code = path.split("/").pop() || "";

  const clientCode = localStorage.getItem("clientCode");

  useEffect(() => {
    const fetchExhibitDetails = async () => {
      try {
        const response = await api.get(`/api/exhibit/${clientCode}/${code}`);
        if (response.status !== 200) {
          toast.error("Failed to fetch exhibits");
          throw new Error("Failed to fetch exhibits");
        }
        const data: { exhibit: ExhibitData } = response.data;
        setExhibitData(data.exhibit);
        setTitle(data.exhibit.title);
        setDescription(data.exhibit.description);
        setTranslations(
          data.exhibit.translations.map((t) => ({
            ...t,
            isModified: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching exhibit detail:", error);
        toast.error("Error fetching exhibit details");
      }
    };

    fetchExhibitDetails();
  }, [code, clientCode]);

  const handleTranslationUpdate = (
    index: number,
    field: keyof Translation,
    value: string
  ) => {
    setTranslations((prevTranslations) =>
      prevTranslations.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              isModified: true,
            }
          : item
      )
    );
  };

  const handleMainInfoUpdate = async () => {
    try {
      setModalLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const response = await api.put(`/api/exhibit/${code}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update main info");
      }

      toast.success("Main information updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update main information");
      console.error("Error updating main info:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleTranslationsUpdate = async () => {
    try {
      setLoading(true);
      const modifiedTranslationsJSON: Record<string, { title: string; description: string }> =
        translations.reduce((acc: Record<string, { title: string; description: string }>, translation) => {
          if (translation.isModified) {
            acc[translation.language] = {
              title: translation.title || "",
              description: translation.description || "",
            };
          }
          return acc;
        }, {});

      const formData = new FormData();

      if (Object.keys(modifiedTranslationsJSON).length > 0) {
        formData.append("translations", JSON.stringify(modifiedTranslationsJSON));
      }

      if (exhibitImage) {
        formData.append("titleImage", exhibitImage);
      }

      if (exhibitISL) {
        formData.append("islVideo", exhibitISL);
      }

      const response = await api.put(`/api/exhibit/${code}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update translations");
      }

      toast.success("Translations updated successfully");
    } catch (error) {
      toast.error("Failed to update translations");
      console.error("Error updating translations:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="mx-auto max-w-270">
      <ToastContainer position="top-right" />
      <Breadcrumb pageName="Edit Exhibit" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Main Information"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Exhibit Title
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Description
            </label>
            <textarea
              className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleMainInfoUpdate}
              disabled={modalLoading}
              className="rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              {modalLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-black dark:text-white">
              Edit Exhibit Information
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Update Main Title & Description
            </button>
          </div>
        </div>

        <div className="p-7">
          {/* Main Info Display */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-medium text-black dark:text-white">Current Title: {title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Description: {description}</p>
          </div>

          {/* Translations Section */}
          <div className="space-y-6">
            {translations.map((translation, index) => (
              <div key={index} className="border-t border-stroke pt-6 dark:border-strokedark">
                <h4 className="mb-4 font-medium text-black dark:text-white">
                  Translation: {translation.language}
                </h4>
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Title
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    value={translation.title}
                    onChange={(e) => handleTranslationUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
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
          </div>

          {/* File Upload Section */}
          <div className="space-y-4 border-t border-stroke pt-6 dark:border-strokedark">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Exhibit Image
              </label>
              <FileDropZone onFileUpload={setExhibitImage} />
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                ISL Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && setExhibitISL(e.target.files[0])}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleTranslationsUpdate}
              disabled={loading}
              className="rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Translations"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExhibit;