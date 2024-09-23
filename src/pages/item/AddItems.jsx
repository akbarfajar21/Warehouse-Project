import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/SupaClient";
import Layout from "../../components/Layout";
import Swal from "sweetalert2";

const AddItems = () => {
  const [nama_barang, setNamaBarang] = useState("");
  const [foto_barang, setFotoBarang] = useState("");
  const [harga, setHarga] = useState("");
  const [jenis_barang, setJenisBarang] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase.from("barang").insert([
        {
          nama_barang,
          foto_barang,
          harga,
          jenis_barang,
          stok,
          deskripsi,
        },
      ]);

      if (error) {
        throw error;
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Barang Berhasil di Tambahkan!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/table");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal Menambahkan Barang!",
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
          <h1 className="text-2xl font-bold mb-4">Tambah Barang</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Barang
              </label>
              <input
                type="text"
                value={nama_barang}
                onChange={(e) => setNamaBarang(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Foto Barang URL
              </label>
              <input
                type="text"
                value={foto_barang}
                onChange={(e) => setFotoBarang(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <input
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Jenis Barang
              </label>
              <select
                value={jenis_barang}
                onChange={(e) => setJenisBarang(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Pilih Jenis Barang</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Bahan Pokok">Bahan Pokok</option>
                <option value="Kebutuhan Rumah Tangga">
                  Kebutuhan Rumah Tangga
                </option>
                <option value="Kemasan">Kemasan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stok</label>
              <input
                type="number"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Item
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

export default AddItems;
