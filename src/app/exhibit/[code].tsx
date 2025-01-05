import ECommerce from "@/components/Dashboard/Exhibit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ExhibitUpload from "@/components/Dashboard/Exhibit";
import { useRouter } from "next/router";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

export default function Page() {
    const router = useRouter()
    return <p>Post: {router.query.slug}</p>
  }
  

