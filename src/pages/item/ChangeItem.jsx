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
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching item:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("barang")
      .update(formData)
      .eq("id", id);

    if (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal Update barang",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating item:", error);
    } else {
      Swal.fire({
        title: "Success!",
        text: "Item berhasil diupdate!.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/table");
        }
      });
    }
  };

  if (!item) return <div>Loading...</div>;

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
          <Input
            className="w-full"
            clearable
            underlined
            label="Foto Barang URL"
            name="foto_barang"
            value={formData.foto_barang}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            type="number"
            label="Harga"
            name="harga"
            value={formData.harga}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">Jenis Barang</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              name="jenis_barang"
              value={formData.jenis_barang}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Jenis Barang</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Bahan Pokok">Bahan Pokok</option>
              <option value="Kebutuhan Rumah Tangga">Kebutuhan Rumah Tangga</option>
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
            required
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
            required
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
