import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import { EyeIcon } from "./icons/EyeIcon";
import { EditIcon } from "./icons/EditIcon";
import { DeleteIcon } from "./icons/DeleteIcon";
import useFormatRupiah from "../hooks/useFormatRupiah";
import useTruncateText from "../hooks/useTruncateText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../utils/SupaClient";
import { useAuth } from "../auth/AuthProvider"; 

const columns = [
  { key: "foto_barang", label: "Foto Barang" },
  { key: "nama_barang", label: "Nama Barang" },
  { key: "harga", label: "Harga" },
  { key: "jenis_barang", label: "Jenis Barang" },
  { key: "stok", label: "Stok" },
  { key: "deskripsi", label: "Deskripsi" },
  { key: "action", label: "Action" },
];

export default function ColumnEdit({ allBarang, setAllBarang }) {
  const { formatRupiah } = useFormatRupiah();
  const { truncateText } = useTruncateText();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const navigate = useNavigate();

  const { role } = useAuth();

  const pages = Math.ceil(allBarang.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return allBarang.slice(start, end);
  }, [page, allBarang]);

  const handleEditClick = (itemId) => {
    if (role === "admin") {
      navigate(`/change-item/${itemId}`);
    } else {
      navigate("/login");
    }
  };

  const handleDeleteClick = async (itemId, itemName, foto_barang) => {
    if (role === "admin") {
      const result = await Swal.fire({
        title: `Hapus Barang ${itemName}?`,
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
          // Menghapus foto dari storage
          const fileName = foto_barang.split('/').pop(); // Mengambil nama file dari URL
          const { error: storageError } = await supabase.storage
            .from("fotoproduct")
            .remove([`foto_product/${fileName}`]);
          
          if (storageError) {
            throw storageError;
          }

          // Menghapus dari database
          const { error } = await supabase
            .from("barang")
            .delete()
            .eq("id", itemId);

          if (error) {
            throw error;
          }

          Swal.fire({
            title: "Berhasil!",
            text: "Barang berhasil dihapus!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Gagal menghapus barang. Silakan coba lagi.",
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

  React.useEffect(() => {
    if (items.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [items, page]);

  return (
    <Table
      aria-label="Example table with client-side pagination"
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
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell key={columnKey}>
                {columnKey === "foto_barang" ? (
                  <img
                    src={item[columnKey]}
                    alt={item.nama_barang}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                ) : columnKey === "action" ? (
                  <div className="relative flex items-center gap-5 p-2">
                    <Link to={`/detail/${item.id}`}>
                      <Tooltip content="Detail Barang">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <EyeIcon />
                        </span>
                      </Tooltip>
                    </Link>
                    {role === "admin" ? (
                      <>
                        <Tooltip content="Edit Barang">
                          <span
                            onClick={() => handleEditClick(item.id)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EditIcon />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Hapus Barang">
                          <span
                            onClick={() =>
                              handleDeleteClick(item.id, item.nama_barang, item.foto_barang)
                            }
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip content="Login to Edit Barang">
                          <span
                            onClick={() => navigate("/login")}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EditIcon />
                          </span>
                        </Tooltip>
                        <Tooltip content="Login to Hapus Barang" color="danger">
                          <span
                            onClick={() => navigate("/login")}
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </div>
                ) : columnKey === "harga" ? (
                  formatRupiah(item[columnKey])
                ) : columnKey === "jenis_barang" ? (
                  <span className="capitalize">{item[columnKey]}</span>
                ) : columnKey === "deskripsi" ? (
                  truncateText(item[columnKey], 25)
                ) : (
                  item[columnKey]
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
