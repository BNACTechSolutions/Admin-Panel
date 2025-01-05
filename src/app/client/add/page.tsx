import ECommerce from "@/components/Dashboard/AddAdmin";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout_Admin";
import { Sign } from "crypto";
import AddClient from "@/components/Dashboard/AddClient";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

const Exhibit = () => {
  return (
    <>
    
      <DefaultLayout>
        <AddClient/>
      </DefaultLayout>
    </>
  );
}

export default Exhibit;

