import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableAllAdvertisers from "../Tables/TableAllAdvertisers";

const AllAdvertisers = () => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="All Advertisers" />

      <div className="">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Advertisers Available
              </h3>
            </div>
            <div className=" overflow-y-auto">
              <TableAllAdvertisers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAdvertisers;