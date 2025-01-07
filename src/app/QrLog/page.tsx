import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ClientQrLogs from "@/components/Dashboard/ClientQrDisplay";

const ClientSideQR = () => {
  return (
    <>
      <DefaultLayout>
        <ClientQrLogs/>
      </DefaultLayout>
    </>
  );
}

export default ClientSideQR;