import { Metadata } from "next";
import { useRouter } from "next/router";

export const metadata: Metadata = {
  title: "Admin and Client Frontend",
  description: "Admin and client frontend",
};

export default function Page() {
    const router = useRouter()
    return <p>Post: {router.query.slug}</p>
  }
  

