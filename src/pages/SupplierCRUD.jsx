import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tooltip,
  Button,
  Spinner,
} from "@nextui-org/react";
import { EyeIcon } from "./icons/EyeIcon";
import { EditIcon } from "./icons/EditIcon";
import { DeleteIcon } from "./icons/DeleteIcon";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../utils/SupaClient";
import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthProvider";

const columns = [
  { key: "logo_supplier", label: "Logo Supplier" },
  { key: "nama_supplier", label: "Nama Supplier" },
  { key: "no_hp", label: "No HP" },
  { key: "alamat", label: "Alamat" },
  { key: "email", label: "Email" },
  { key: "action", label: "Action" },
];

export default function SupplierCRUD() {
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;
  const navigate = useNavigate();
  const { role, user } = useAuth();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const pages = Math.ceil(allSuppliers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return allSuppliers.slice(start, end);
  }, [page, allSuppliers]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("suppliers").select("*");

      if (error) {
        throw error;
      }

      setAllSuppliers(data || []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (supplierId) => {
    if (role === "admin") {
      navigate(`/edit-supplier/${supplierId}`);
    } else {
      navigate("/login"); 
    }
  };

  const handleDeleteClick = async (supplierId, supplierName) => {
    if (role === "admin") {
      const result = await Swal.fire({
        title: `Hapus Supplier ${supplierName}?`,
        text: "Anda tidak akan bisa mengembalikannya!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from("suppliers")
            .delete()
            .eq("id_supplier", supplierId);

          if (error) {
            throw error;
          }

          Swal.fire({
            title: "Berhasil!",
            text: "Supplier berhasil dihapus!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            fetchSuppliers();
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Gagal menghapus supplier. Silakan coba lagi.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error(error);
        }
      }
    } else {
      navigate("/login");  
    }
  };

  useEffect(() => {
    if (items.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [items, page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center px-4 py-2">
        <h2 className="text-2xl font-semibold mb-2 sm:mb-0">Suppliers List</h2>
        {user && role === "admin" ? (
          <Button
            auto
            color="primary"
            onClick={() => navigate("/add-supplier")}
          >
            + Add Supplier
          </Button>
        ) : (
          <Link to={"/login"}>
            <Button color="primary">Login sebagai admin</Button>
          </Link>
        )}
      </div>
      <Table
        aria-label="Supplier table with client-side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="warning"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn key={col.key}>{col.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id_supplier}>
              {(columnKey) => (
                <TableCell key={columnKey}>
                  {columnKey === "logo_supplier" ? (
                    <img
                      src={item[columnKey]}
                      alt={item.nama_supplier}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  ) : columnKey === "alamat" ? (
                    <Tooltip content={item[columnKey]}>
                      <span>
                        {item[columnKey].split(" ").slice(0, 5).join(" ")}...
                      </span>
                    </Tooltip>
                  ) : columnKey === "action" ? (
                    <div className="relative flex items-center gap-5 p-2">
                      <Link to={`/detail-supplier/${item.id_supplier}`}>
                        <Tooltip content="Detail Supplier">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EyeIcon />
                          </span>
                        </Tooltip>
                      </Link>
                      <Tooltip content="Edit Supplier">
                        <span
                          onClick={() => handleEditClick(item.id_supplier)}
                          className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        >
                          <EditIcon />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Hapus Supplier">
                        <span
                          onClick={() =>
                            handleDeleteClick(
                              item.id_supplier,
                              item.nama_supplier
                            )
                          }
                          className="text-lg text-danger cursor-pointer active:opacity-50"
                        >
                          <DeleteIcon />
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    item[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Layout>
  );
}
