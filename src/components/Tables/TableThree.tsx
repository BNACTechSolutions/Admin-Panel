"use client";
import { useState, useEffect } from "react";
import { ExhibitItemProps } from "@/types/exhibits"; // assuming your type is defined in exhibit.ts
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import api from "@/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TableThree = () => {
  const [exhibits, setExhibits] = useState<ExhibitItemProps[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedExhibit, setSelectedExhibit] = useState<string | null>(null);
  const router = useRouter();

  // Fetch exhibits data on component mount
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await api.get('/api/exhibit/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        
        if (response.status !== 200) {
          throw new Error('Failed to fetch exhibits');
        }
        const data = response.data;
        setExhibits(data.exhibits || []); // Assuming the data structure is { exhibits: [...data] }
      } catch (error: any) {
        if(error.response.status === 403){
          toast.error("error: ", error.response.status );
          // toast.error(error.response.statusText);
          router.push("/auth/signin");
        }
        console.error("Error fetching exhibits:", error);
      }
    };

    fetchExhibits();

  }, []); // Empty array ensures this runs once on mount

  // Edit exhibit function
  const editExhibit = (code: string) => {
    router.push(`/exhibit/${code}`);
  };

  const confirmDeleteExhibit = (code: string) => {
    setSelectedExhibit(code);
    setShowModal(true);
  };

  const deleteExhibit = async () => {
    if (!selectedExhibit) return;
    try {
      const response = await api.delete(`/api/exhibit/${selectedExhibit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete exhibit');
      }
      const data = response.data;
      // Update exhibits state after deletion
      setExhibits(exhibits.filter((exhibit) => exhibit.code !== selectedExhibit));
    } catch (error) {
      console.error("Error deleting exhibit:", error);
    } finally {
      setShowModal(false);
      setSelectedExhibit(null);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer position="top-right" />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Exhibit Title
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Exhibit Code
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {exhibits.map((exhibit, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {exhibit.title}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {exhibit.code}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      exhibit.status === 1
                        ? "bg-green-500"
                        : exhibit.status === 0
                        ? "bg-red-500"
                        : "bg-orange-400"
                    }`}
                  >
                    {exhibit.status === 1
                      ? "Active"
                      : exhibit.status === 0
                      ? "Inactive"
                      : "Pending"}
                  </span>
                </td> 
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary" onClick={() => editExhibit(exhibit.code)}>
                      <Icon icon="material-symbols:edit-sharp" />
                    </button>
                    <button onClick={() => confirmDeleteExhibit(exhibit.code)} className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    {exhibit.status === 2 && (
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                        onClick={async () => {
                          try {
                            const response = await api.put(`/api/exhibit/approve/${exhibit.code}`, {}, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                              },
                            });
                            if (response.status === 200) {
                              toast.success('Exhibit approved!');
                              setExhibits((prev) =>
                                prev.map((ex) =>
                                  ex.code === exhibit.code ? { ...ex, status: 1 } : ex
                                )
                              );
                            } else {
                              toast.error('Failed to approve exhibit');
                            }
                          } catch (error) {
                            toast.error('Failed to approve exhibit');
                          }
                        }}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this exhibit?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteExhibit}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableThree;
