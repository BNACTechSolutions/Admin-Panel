import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
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
