import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableClientAds from "../Tables/TableClientAds";

const AddClientAds = () => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Client Advertisement Link" />

      <div className="">
        <div className="col-span-5 xl:col-span-3"   >
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Client Advertisement Detail
              </h3>
            </div>
            <div className=" overflow-y-auto">
              <TableClientAds />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientAds;
