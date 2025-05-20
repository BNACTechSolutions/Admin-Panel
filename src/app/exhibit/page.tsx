import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ExhibitUpload from "@/components/Dashboard/Exhibit";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

const Exhibit = () => {
  return (
    <>
    
      <DefaultLayout>
        <ExhibitUpload/>
      </DefaultLayout>
    </>
  );
}

export default Exhibit;

