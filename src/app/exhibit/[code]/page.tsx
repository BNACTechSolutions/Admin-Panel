"use client";

import EditExhibit from "@/components/Dashboard/EditExhibit";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function PostPage() {
    const { slug } = useParams() as { slug: string }
    const route = useRouter();

  const pathname = usePathname();

  console.log(route);

  return (
    <DefaultLayout>
      <EditExhibit/>
    </DefaultLayout>
  );
}
