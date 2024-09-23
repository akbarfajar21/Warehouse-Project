import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../utils/SupaClient";
import { Spinner } from "@nextui-org/react";

const ITEMS_PER_PAGE = 8; 

const AllBarang = () => {
  const [barang, setBarang] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("barang");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: barangData, error: barangError } = await supabase
        .from("barang")
        .select("*");

      if (barangError) {
        throw barangError;
      }

      setBarang(barangData);
      const { data: suppliersData, error: suppliersError } = await supabase
        .from("suppliers")
        .select("*");

      if (suppliersError) {
        throw suppliersError;
      }

      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems =
    filter === "barang"
      ? barang.slice(indexOfFirstItem, indexOfLastItem)
      : suppliers.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems =
    filter === "barang" ? barang.length : suppliers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <Layout>
      <section id="all-barang" className="p-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-4xl font-bold">Semua Barang</h2>
          <div>
            <label htmlFor="filter" className="mr-2">
              Filter:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1); 
              }}
              className="p-2 border rounded-md"
            >
              <option value="barang">Barang</option>
              <option value="suppliers">Suppliers</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filter === "barang" &&
                currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-lg p-4"
                  >
                    {item.foto_barang && (
                      <img
                        src={item.foto_barang}
                        alt={item.nama_barang}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">
                      {item.nama_barang}
                    </h3>
                    <p className="text-gray-600">Harga: {item.harga}</p>
                    <p className="text-gray-600">Stok: {item.stok}</p>
                    <p className="text-gray-600">Deskripsi: {item.deskripsi}</p>
                  </div>
                ))}

              {filter === "suppliers" &&
                currentItems.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-lg p-4"
                  >
                    {supplier.logo_supplier && (
                      <img
                        src={supplier.logo_supplier}
                        alt={supplier.nama_supplier}
                        className="w-full h-32 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">
                      {supplier.nama_supplier}
                    </h3>
                    <p className="text-gray-600">Alamat: {supplier.alamat}</p>
                    <p className="text-gray-600">Telepon: {supplier.telepon}</p>
                  </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-white rounded-md bg-blue-500"
              >
                &lt;
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === page + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500 border-blue-500"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-white rounded-md bg-blue-500"
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default AllBarang;
