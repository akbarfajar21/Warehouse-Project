import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { supabase } from "../../utils/SupaClient";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the spinner component

const SupplierDetail = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSupplier = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id_supplier", id)
        .single();

      if (error) {
        throw error;
      }

      setSupplier(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  if (!supplier) {
    return <p>Supplier not found.</p>;
  }

  const { nama_supplier, logo_supplier, no_hp, alamat, email } = supplier;

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 md:p-10">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 border border-gray-200 w-full max-w-3xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src={logo_supplier}
                alt={nama_supplier}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{nama_supplier}</h1>

              <div className="mb-4">
                <strong>No HP: </strong>
                <span className="text-xl font-semibold">{no_hp}</span>
              </div>

              <div className="mb-4">
                <strong>Alamat: </strong>
                <p>{alamat}</p>
              </div>

              <div className="mb-4">
                <strong>Email: </strong>
                <a href={`mailto:${email}`} className="text-blue-500">
                  {email}
                </a>
              </div>

              <button
                onClick={() => navigate("/suppliers")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  className="mr-2"
                >
                  <mask id="ipSBack0">
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      stroke="#fff"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z"
                      clipRule="evenodd"
                    />
                  </mask>
                  <path
                    fill="currentColor"
                    d="M0 0h48v48H0z"
                    mask="url(#ipSBack0)"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierDetail;
