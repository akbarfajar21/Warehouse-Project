import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { supabase } from "../../utils/SupaClient";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";

export default function ChangeSupplier() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [formData, setFormData] = useState({
    nama_supplier: "",
    logo_supplier: "",
    no_hp: "",
    alamat: "",
    email: "",
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id_supplier", id)
        .single();

      if (error) {
        console.error("Error fetching supplier:", error);
        return;
      }

      setSupplier(data);
      setFormData({
        nama_supplier: data.nama_supplier,
        logo_supplier: data.logo_supplier,
        no_hp: data.no_hp,
        alamat: data.alamat,
        email: data.email,
      });
    };

    fetchSupplier();
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
      .from("suppliers")
      .update(formData)
      .eq("id_supplier", id); 

    if (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal Update Supplier",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating supplier:", error);
    } else {
      Swal.fire({
        title: "Success!",
        text: "Supplier berhasil diupdate!",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/suppliers");
        }
      });
    }
  };

  if (!supplier) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Edit Supplier</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="w-full"
            clearable
            underlined
            label="Nama Supplier"
            name="nama_supplier"
            value={formData.nama_supplier}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            label="Logo Supplier URL"
            name="logo_supplier"
            value={formData.logo_supplier}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            type="text"
            label="No HP"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <Input
            className="w-full"
            clearable
            underlined
            type="email"
            label="Email"
            name="email"
            value={formData.email}
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
              onClick={() => navigate("/suppliers")}
            >
              Kembali
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
