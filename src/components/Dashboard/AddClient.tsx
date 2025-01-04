"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import api from "@/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Import toast function
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const AddClient = () => {
  const router = useRouter();
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    mobile: "",
    status: 1,
    allottedUsers: 0,
    displayAllotted: 0,
    textSize: 2,
    validityDays: 365,
    audio: true,
    isl: false,
    video: false,
    languages: ["english"],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setClientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setClientData((prev) => {
      const languages = [...prev.languages];
      if (checked) {
        languages.push(value);
      } else {
        const index = languages.indexOf(value);
        if (index > -1) languages.splice(index, 1);
      }
      return { ...prev, languages };
    });
  };

  const handleSubmit = async () => {
    var message;
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post("/api/client/add", clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message = response.data;

      if (response.status >= 200 && response.status <= 203) {
        // Success notification
        toast.success("Client added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        router.push("/admin/client");
      } else {
        throw new Error("Failed to add client.");
      }
    } catch (error) {
      // Error notification
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Add Client" />

      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Client Information
            </h3>
          </div>
          <div className="p-7">
            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Name
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="text"
                name="name"
                value={clientData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="email"
                name="email"
                value={clientData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Mobile
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="tel"
                name="mobile"
                value={clientData.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Status
              </label>
              <select
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                name="status"
                value={clientData.status}
                onChange={handleInputChange}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Allotted Users
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="number"
                name="allottedUsers"
                value={clientData.allottedUsers}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Display Allotted
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="number"
                name="displayAllotted"
                value={clientData.displayAllotted}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Text Size
              </label>
              <select
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                name="textSize"
                value={clientData.textSize}
                onChange={handleInputChange}
              >
                <option value={1}>Small</option>
                <option value={2}>Medium</option>
                <option value={3}>Large</option>
              </select>
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Validity Days
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                type="number"
                name="validityDays"
                value={clientData.validityDays}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Features
              </label>
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="checkbox"
                    name="audio"
                    checked={clientData.audio}
                    onChange={handleInputChange}
                  />
                  Audio
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="isl"
                    checked={clientData.isl}
                    onChange={handleInputChange}
                  />
                  ISL
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="video"
                    checked={clientData.video}
                    onChange={handleInputChange}
                  />
                  Video
                </label>
              </div>
            </div>
            
            <div className="mb-5.5">
  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
    Languages
  </label>
  <div className="flex flex-wrap gap-4 max-h-60 overflow-y-auto border border-stroke p-4 rounded">
    {/* Indian Languages */}
    <label>
      <input
        type="checkbox"
        value="hindi"
        checked={clientData.languages.includes("hindi")}
        onChange={handleLanguageChange}
      />
      Hindi
    </label>
    <label>
      <input
        type="checkbox"
        value="tamil"
        checked={clientData.languages.includes("tamil")}
        onChange={handleLanguageChange}
      />
      Tamil
    </label>
    <label>
      <input
        type="checkbox"
        value="telugu"
        checked={clientData.languages.includes("telugu")}
        onChange={handleLanguageChange}
      />
      Telugu
    </label>
    <label>
      <input
        type="checkbox"
        value="bengali"
        checked={clientData.languages.includes("bengali")}
        onChange={handleLanguageChange}
      />
      Bengali
    </label>
    <label>
      <input
        type="checkbox"
        value="marathi"
        checked={clientData.languages.includes("marathi")}
        onChange={handleLanguageChange}
      />
      Marathi
    </label>
    <label>
      <input
        type="checkbox"
        value="gujarati"
        checked={clientData.languages.includes("gujarati")}
        onChange={handleLanguageChange}
      />
      Gujarati
    </label>
    <label>
      <input
        type="checkbox"
        value="punjabi"
        checked={clientData.languages.includes("punjabi")}
        onChange={handleLanguageChange}
      />
      Punjabi
    </label>
    <label>
      <input
        type="checkbox"
        value="kannada"
        checked={clientData.languages.includes("kannada")}
        onChange={handleLanguageChange}
      />
      Kannada
    </label>
    <label>
      <input
        type="checkbox"
        value="malayalam"
        checked={clientData.languages.includes("malayalam")}
        onChange={handleLanguageChange}
      />
      Malayalam
    </label>
    <label>
      <input
        type="checkbox"
        value="odia"
        checked={clientData.languages.includes("odia")}
        onChange={handleLanguageChange}
      />
      Odia
    </label>
    <label>
      <input
        type="checkbox"
        value="assamese"
        checked={clientData.languages.includes("assamese")}
        onChange={handleLanguageChange}
      />
      Assamese
    </label>
    <label>
      <input
        type="checkbox"
        value="urdu"
        checked={clientData.languages.includes("urdu")}
        onChange={handleLanguageChange}
      />
      Urdu
    </label>
    <label>
      <input
        type="checkbox"
        value="sanskrit"
        checked={clientData.languages.includes("sanskrit")}
        onChange={handleLanguageChange}
      />
      Sanskrit
    </label>

    {/* International Languages */}
    <label>
      <input
        type="checkbox"
        value="english"
        checked={clientData.languages.includes("english")}
        onChange={handleLanguageChange}
      />
      English
    </label>
    <label>
      <input
        type="checkbox"
        value="spanish"
        checked={clientData.languages.includes("spanish")}
        onChange={handleLanguageChange}
      />
      Spanish
    </label>
    <label>
      <input
        type="checkbox"
        value="french"
        checked={clientData.languages.includes("french")}
        onChange={handleLanguageChange}
      />
      French
    </label>
    <label>
      <input
        type="checkbox"
        value="german"
        checked={clientData.languages.includes("german")}
        onChange={handleLanguageChange}
      />
      German
    </label>
    <label>
      <input
        type="checkbox"
        value="mandarin"
        checked={clientData.languages.includes("mandarin")}
        onChange={handleLanguageChange}
      />
      Mandarin
    </label>
    <label>
      <input
        type="checkbox"
        value="japanese"
        checked={clientData.languages.includes("japanese")}
        onChange={handleLanguageChange}
      />
      Japanese
    </label>
    <label>
      <input
        type="checkbox"
        value="arabic"
        checked={clientData.languages.includes("arabic")}
        onChange={handleLanguageChange}
      />
      Arabic
    </label>
    <label>
      <input
        type="checkbox"
        value="russian"
        checked={clientData.languages.includes("russian")}
        onChange={handleLanguageChange}
      />
      Russian
    </label>
    <label>
      <input
        type="checkbox"
        value="portuguese"
        checked={clientData.languages.includes("portuguese")}
        onChange={handleLanguageChange}
      />
      Portuguese
    </label>
    <label>
      <input
        type="checkbox"
        value="italian"
        checked={clientData.languages.includes("italian")}
        onChange={handleLanguageChange}
      />
      Italian
    </label>
    <label>
      <input
        type="checkbox"
        value="korean"
        checked={clientData.languages.includes("korean")}
        onChange={handleLanguageChange}
      />
      Korean
    </label>
    <label>
      <input
        type="checkbox"
        value="thai"
        checked={clientData.languages.includes("thai")}
        onChange={handleLanguageChange}
      />
      Thai
    </label>
  </div>
</div>


            <button
              onClick={handleSubmit}
              className="mt-4 rounded bg-primary px-6 py-3 text-white"
            >
              Add Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
