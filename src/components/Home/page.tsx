"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs_client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "0") {
      router.push("/auth/signin");
    }

    const userData = localStorage.getItem("userData") || "{}";
    setUserInfo(JSON.parse(userData));
  }, [router]);

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = userInfo?.qrURL ? userInfo.qrURL : "/qrcode_placeholder.png";
    link.download = "qr_code.png";
    link.click();
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Home Page" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Welcome User
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2 flex flex-col">
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >{userInfo?.email}</div>
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >{userInfo?.mobile}</div>
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Role
                    </label>
                    <div className="relative">
                      <div
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >{(userInfo?.userType === "0") ? "Admin": "Client-User" }</div>
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Client ID
                    </label>
                    <div className="relative">
                      <div
                        className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >{userInfo?.clientId}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 ">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white "
                    htmlFor="username"
                  >
                    QR Code
                  </label>
                  <Image
                    src={userInfo?.qrURL? userInfo.qrURL: "/qrcode_placeholder.png"}
                    alt="landing image"
                    width={200}
                    height={200}
                  />
                  {userInfo?.qrURL && <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={downloadQRCode}
                  >
                    Download QR Code
                  </button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
