import DefaultLayout from "@/components/Layouts/DefaultLayout_Admin";
import ActivityLog from "@/components/Dashboard/ActivityLog";

const AdminActivityLog = () => {
  return (
    <>
      <DefaultLayout>
        <ActivityLog/>
      </DefaultLayout>
    </>
  );
}

export default AdminActivityLog;