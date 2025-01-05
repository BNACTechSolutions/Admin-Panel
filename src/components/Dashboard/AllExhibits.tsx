import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FileDropZone from "../FormElements/FileDropZone";
import { Icon } from "@iconify/react/dist/iconify.js";
import TableThree from "../Tables/TableThree";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AllExhibit = () => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="All Exhibits" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Exhibits
              </h3>
            </div>
            <div className=" overflow-y-auto">
              <TableThree />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllExhibit;
