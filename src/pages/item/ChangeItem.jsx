import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { supabase } from "../../utils/SupaClient";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";

export default function ChangeItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    nama_barang: "",
    foto_barang: "",
    harga: "",
    jenis_barang: "",
    stok: "",
    deskripsi: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching item:", error);
        setLoading(false);
        return;
      }

      setItem(data);
      setFormData({
        nama_barang: data.nama_barang,
        foto_barang: data.foto_barang,
        harga: data.harga,
        jenis_barang: data.jenis_barang,
        stok: data.stok,
        deskripsi: data.deskripsi,
      });
      setPreviewImage(data.foto_barang);
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        foto_barang: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let foto_barang_url = formData.foto_barang;

    try {
      if (formData.foto_barang instanceof File) {
        if (item.foto_barang) {
          const fileName = item.foto_barang.split("/").pop();
          console.log("Deleting old file:", fileName);

          const { error: deleteError } = await supabase.storage
            .from("fotoproduct")
            .remove([`foto_product/${fileName}`]);

          if (deleteError) {
            console.error("Error deleting old file:", deleteError.message);
            throw new Error(
              "Gagal menghapus foto barang lama: " + deleteError.message
            );
          } else {
            console.log("Old file deleted successfully:", fileName);
          }
        }
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("fotoproduct")
          .upload(
            `foto_product/${formData.foto_barang.name}`,
            formData.foto_barang
          );

        if (uploadError) {
          throw new Error(
            "Gagal mengunggah foto barang: " + uploadError.message
          );
        }

        foto_barang_url = `https://nohdhimjdnmcytzooteh.supabase.co/storage/v1/object/public/fotoproduct/foto_product/${formData.foto_barang.name}`;

        console.log("Uploaded new file URL:", foto_barang_url);
      } else {
        foto_barang_url = item.foto_barang;
      }

      const { error } = await supabase
        .from("barang")
        .update({ ...formData, foto_barang: foto_barang_url })
        .eq("id", id);

      if (error) {
        throw new Error("Gagal update barang: " + error.message);
      } else {
        Swal.fire({
          title: "Success!",
          text: "Item berhasil diupdate!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/table");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error in handleSubmit:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-t-4 border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-blue-500 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!item) return <div className="text-center mt-4">Item not found</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Edit Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="w-full"
            clearable
            underlined
            label="Nama Barang"
            name="nama_barang"
            value={formData.nama_barang}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />

          <input
            className="w-full border p-2 rounded-lg"
            type="file"
            accept="image/*"
            name="foto_barang"
            onChange={handleImageChange}
          />

          {previewImage ? (
            <img
              src={previewImage}
              alt={formData.nama_barang}
              className="h-32 w-32 object-cover mt-2"
            />
          ) : item?.foto_barang ? (
            <img
              src={item.foto_barang}
              alt={formData.nama_barang}
              className="h-32 w-32 object-cover mt-2"
            />
          ) : null}

          <Input
            className="w-full"
            clearable
            underlined
            type="number"
            label="Harga"
            name="harga"
            value={formData.harga}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Jenis Barang
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              name="jenis_barang"
              value={formData.jenis_barang}
              onChange={handleInputChange}
            >
              <option value="">Select Jenis Barang</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Bahan Pokok">Bahan Pokok</option>
              <option value="Kebutuhan Rumah Tangga">
                Kebutuhan Rumah Tangga
              </option>
              <option value="Kemasan">Kemasan</option>
            </select>
          </div>
          <Input
            className="w-full"
            clearable
            underlined
            type="number"
            label="Stok"
            name="stok"
            value={formData.stok}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            label="Deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <div className="flex gap-4">
            <Button className="w-full" type="submit" color="primary">
              Update
            </Button>
            <Button
              className="w-full"
              type="button"
              color="secondary"
              onClick={() => navigate("/table")}
            >
              Kembali
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
