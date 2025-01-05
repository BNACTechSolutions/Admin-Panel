import ECommerce from "@/components/Dashboard/Exhibit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";
import { Sign } from "crypto";
import ExhibitUpload from "@/components/Dashboard/Exhibit";
import Landing from "@/components/Landing/page";
import HomePage from "@/components/Home/page";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

export default function Home() {
  return (
    <>
    
      <DefaultLayout>
        <HomePage/>
      </DefaultLayout>
    </>
  );
}
