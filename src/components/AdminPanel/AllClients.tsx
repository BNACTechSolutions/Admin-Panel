"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs_client";
import TableFour from "../Tables/TableFour_Admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AllClients = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/auth/admin/signin");
    }
  }, [router]);
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="All Clients" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Clients
              </h3>
            </div>
            <div className=" overflow-y-auto">
              <TableFour />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllClients;