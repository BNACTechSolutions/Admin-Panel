import DefaultLayout from "@/components/Layouts/DefaultLayout_Admin";
import AdminQrLogs from "@/components/Dashboard/AdminSideExhibitLogs";

const AdminSideExhibit = () => {
  return (
    <>
      <DefaultLayout>
        <AdminQrLogs/>
      </DefaultLayout>
    </>
  );
}

export default AdminSideExhibit;