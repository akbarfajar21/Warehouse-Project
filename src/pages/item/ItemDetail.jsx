import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { supabase } from "../../utils/SupaClient";
import { useParams, useNavigate } from "react-router-dom";

const ItemDetail = () => {
  const [getBarangById, setGetBarangById] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const getIdBarang = async () => {
    try {
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setGetBarangById(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getIdBarang();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!getBarangById) {
    return <p>Item not found.</p>;
  }

  const { nama_barang, foto_barang, harga, jenis_barang, stok, deskripsi } =
    getBarangById;

  return (
    <Layout>
      <div className="flex justify-center items-center p-6 md:p-10">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 border border-gray-200 w-full max-w-screen-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <img
                src={foto_barang}
                alt={nama_barang}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h1 className="text-xl md:text-2xl font-bold mb-4">{nama_barang}</h1>

              <div className="mb-4">
                <strong>Harga: </strong>
                <span className="text-lg md:text-xl font-semibold text-green-500">
                  Rp {Number(harga).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mb-4">
                <strong>Jenis Barang: </strong>
                <span className="capitalize">{jenis_barang}</span>
              </div>

              <div className="mb-4">
                <strong>Stok: </strong>
                <span>{stok}</span>
              </div>

              <div className="mb-4">
                <strong>Deskripsi: </strong>
                <p className="text-justify">{deskripsi}</p>
              </div>
              <button
                onClick={() => navigate("/table")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                >
                  <path d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z" />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
