import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ColoumEdit from "../components/ColoumEdit";
import { supabase } from "../utils/SupaClient";
import { Button, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const TableBarang = () => {
  const [allBarang, setAllBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
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

  const { user, role } = useAuth();

  useEffect(() => {
    getAllBarang();
  }, []);

  useEffect(() => {
    getAllBarang();
  }, [category]);

  const handleAddItem = () => {
    navigate("/add-items");
  };

  const filteredBarang = allBarang.filter((barang) =>
    barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <section id="table-barang" className="p-1">
        <div className="flex flex-col md:flex-row md:justify-between mb-5">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
            Table Barang
          </h2>
          {user && role === "admin" ? (
            <Button
              color="primary"
              onClick={handleAddItem}
              className="w-full md:w-auto"
            >
              + Tambah Barang
            </Button>
          ) : (
            <Link to={"/login"}>
              <Button color="primary">Login sebagai admin</Button>
            </Link>
          )}
        </div>

        <div className="mb-5 flex flex-col md:flex-row md:items-center">
          <div className="mr-2">
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

          <div className="mt-4 md:mt-0">
            <label htmlFor="searchTerm" className="mr-2">Cari Barang:</label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md"
              placeholder="Search Barang..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
          <ColoumEdit allBarang={filteredBarang} />
        )}
      </section>
    </Layout>
  );
};

export default TableBarang;
