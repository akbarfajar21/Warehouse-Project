import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import LoadingSkeleton from "../components/nextui/LoadingSkeleton";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [barang, setBarang] = useState(0);
  const [jenisBarangCount, setJenisBarangCount] = useState({});
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);

  const totalBarang = async () => {
    setLoadingSkeleton(true);

    try {
      const countTotalBarang = supabase
        .from("barang")
        .select("*", { count: "exact", head: true });

      const jenisBarang = [
        "Makanan",
        "Minuman",
        "Bahan Pokok",
        "Kebutuhan Rumah Tangga",
        "Kemasan",
      ];

      const countTotalJenisBarang = jenisBarang.map((jenis) =>
        supabase
          .from("barang")
          .select("*", { count: "exact", head: true })
          .eq("jenis_barang", jenis)
      );

      const results = await Promise.all([
        countTotalBarang,
        ...countTotalJenisBarang,
      ]);

      const totalCount = results[0].count;
      let counts = {};
      results.slice(1).forEach((result, index) => {
        counts[jenisBarang[index]] = result.count;
      });

      setBarang(totalCount);
      setJenisBarangCount(counts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSkeleton(false);
    }
  };

  useEffect(() => {
    totalBarang();
  }, []);

  return (
    <Layout>
      <section id="dashboard" className="p-4 md:p-10">
        <div className="bg-blue-500 text-white rounded-lg h-auto md:h-48 p-6 md:p-10">
          <h2 className="text-2xl md:text-4xl">Selamat Datang Admin</h2>
          <p className="text-sm md:text-lg mt-2">
            Selamat Datang di Warehouse Rabbaanii
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6 w-full">
          {loadingSkeleton ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : (
            <>
              <div className="p-6 md:p-8 bg-green-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-3xl">Total Makanan</h2>
                <p className="text-lg md:text-3xl mt-2 font-bold">
                  {jenisBarangCount.Makanan} BARANG
                </p>
              </div>

              <div className="p-6 md:p-8 bg-purple-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-3xl">Total Minuman</h2>
                <p className="text-lg md:text-3xl mt-2 font-bold">
                  {jenisBarangCount.Minuman} BARANG
                </p>
              </div>

              <div className="p-6 md:p-8 bg-red-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-3xl">Total Bahan Pokok</h2>
                <p className="text-lg md:text-3xl mt-2 font-bold">
                  {jenisBarangCount["Bahan Pokok"]} BARANG
                </p>
              </div>

              <div className="p-6 md:p-8 bg-yellow-600 text-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-3xl">
                  Total Kebutuhan Rumah Tangga
                </h2>
                <p className="text-lg md:text-3xl mt-2 font-bold">
                  {jenisBarangCount["Kebutuhan Rumah Tangga"]} BARANG
                </p>
              </div>

              <div className="p-6 md:p-8 bg-cyan-700 text-white rounded-lg shadow-lg">
                <h2 className="text-lg md:text-3xl">Total Kemasan</h2>
                <p className="text-lg md:text-3xl mt-2 font-bold">
                  {jenisBarangCount.Kemasan} BARANG
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
