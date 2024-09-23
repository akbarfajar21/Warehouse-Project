import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ColoumEdit from "../components/ColoumEdit";
import { supabase } from "../utils/SupaClient";
import { Button, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const TableBarang = () => {
  const [allBarang, setAllBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const getAllBarang = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("barang")
        .select("*")
        .order("id", { ascending: false });

      if (category) {
        query = query.eq("jenis_barang", category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setAllBarang(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBarang();
  }, []);

  useEffect(() => {
    getAllBarang();
  }, [category]);

  const handleAddItem = () => {
    navigate("/add-items");
  };

  return (
    <Layout>
      <section id="table-barang" className="p-8">
        <div className="flex flex-col md:flex-row md:justify-between mb-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
            Table Barang
          </h2>
          <Button
            color="primary"
            onClick={handleAddItem}
            className="w-full md:w-auto"
          >
            + Tambah Barang
          </Button>
        </div>

        <div className="mb-5">
          <label htmlFor="category" className="mr-2">
            Filter Kategori:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Bahan Pokok">Bahan Pokok</option>
            <option value="Kebutuhan Rumah Tangga">
              Kebutuhan Rumah Tangga
            </option>
            <option value="Kemasan">Kemasan</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
          <ColoumEdit allBarang={allBarang} />
        )}
      </section>
    </Layout>
  );
};

export default TableBarang;
