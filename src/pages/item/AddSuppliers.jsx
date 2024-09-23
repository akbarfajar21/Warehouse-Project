import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/SupaClient";
import Layout from "../../components/Layout";
import Swal from "sweetalert2";

const AddSupplier = () => {
  const [nama_supplier, setNamaSupplier] = useState("");
  const [logo_supplier, setLogoSupplier] = useState("");
  const [no_hp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from("suppliers").insert([
        {
          nama_supplier,
          logo_supplier,
          no_hp,
          alamat,
          email,
        },
      ]);

      if (error) {
        throw error;
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Supplier Berhasil di Tambahkan!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/suppliers");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal Menambahkan Supplier!",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">Tambah Supplier</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Supplier
              </label>
              <input
                type="text"
                value={nama_supplier}
                onChange={(e) => setNamaSupplier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Logo Supplier URL
              </label>
              <input
                type="text"
                value={logo_supplier}
                onChange={(e) => setLogoSupplier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No HP</label>
              <input
                type="text"
                value={no_hp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Supplier
            </button>
          </form>

          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AddSupplier;
