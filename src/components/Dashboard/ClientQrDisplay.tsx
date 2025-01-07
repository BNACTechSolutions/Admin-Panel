import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableQrClient from "../Tables/TableQrClient";

const ClientQrLogs = () => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Qr Logs" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Client QR Logs
              </h3>
            </div>
            <div className=" overflow-y-auto">
              <TableQrClient />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientQrLogs;