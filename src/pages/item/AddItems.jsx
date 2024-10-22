import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/SupaClient";
import Layout from "../../components/Layout";
import Swal from "sweetalert2";

const AddItems = () => {
  const [formData, setFormData] = useState({
    nama_barang: "",
    foto_barang: "",
    harga: "",
    jenis_barang: "",
    stok: "",
    deskripsi: "",
  });

  const [previewImage, setPreviewImage] = useState(null); // State untuk menyimpan URL gambar preview
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: uploadImage, error: uploadError } = await supabase.storage
        .from("fotoproduct")
        .upload(
          `foto_product/${formData.foto_barang.name}`,
          formData.foto_barang,
          {
            cacheControl: "3600",
            upsert: true,
          }
        );
      if (uploadError) {
        throw uploadError;
      }

      if (uploadImage) {
        const imageUrl = supabase.storage
          .from("fotoproduct")
          .getPublicUrl(`foto_product/${formData.foto_barang.name}`)
          .data.publicUrl;

        const updateFormData = {
          ...formData,
          foto_barang: imageUrl,
        };

        const { data, error } = await supabase
          .from("barang")
          .insert(updateFormData)
          .select();

        if (error) {
          throw error;
        }

        if (data) {
          Swal.fire({
            title: "Sukses",
            text: "Data Berhasil di input ke database",
            icon: "success",
          }).then(() => {
            window.location.href = "/table"
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Data gagal di input ke database",
        icon: "error",
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleImage = (e) => {
    const file = e.target.files[0]; // Ambil file yang dipilih
    setFormData({
      ...formData,
      foto_barang: file, // Simpan file ke dalam formData
    });

    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Set URL untuk preview
    } else {
      setPreviewImage(null); // Reset jika tidak ada file
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                name="nama_barang"
                value={formData.nama_barang}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Foto Barang
              </label>
              <input
                type="file"
                name="foto_barang"
                onChange={handleImage}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {previewImage && ( // Tampilkan preview gambar jika ada
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover mt-2 border border-gray-300 rounded"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Jenis Barang
              </label>
              <select
                name="jenis_barang"
                value={formData.jenis_barang}
                onChange={handleChange}
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
                name="stok"
                value={formData.stok}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
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
