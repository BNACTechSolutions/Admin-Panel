"use client";

import EditExhibit from "@/components/Dashboard/EditExhibit";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function PostPage() {
  return (
    <DefaultLayout>
      <EditExhibit/>
    </DefaultLayout>
  );
}
