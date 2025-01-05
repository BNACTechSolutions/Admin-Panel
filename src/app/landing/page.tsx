import ECommerce from "@/components/Dashboard/Exhibit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Landing from "@/components/Landing/page";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

export default function Home() {
  return (
    <>
    
      <DefaultLayout>
        <Landing/>
      </DefaultLayout>
    </>
  );
}
