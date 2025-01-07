import DefaultLayout from "@/components/Layouts/DefaultLayout_Admin";
import AdminQrLogs from "@/components/Dashboard/AdminQrDisplay";

const AdminSideQr = () => {
  return (
    <>
      <DefaultLayout>
        <AdminQrLogs/>
      </DefaultLayout>
    </>
  );
}

export default AdminSideQr;