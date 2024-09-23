import React from "react";
import DropdownUser from "./nextui/DropdownUser";
import { useLocation, useParams } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/table":
        return "Table Barang";
      case "/all-barang":
        return "Semua Barang";
      case "/add-items":
        return "Tambah Barang";
      case "/suppliers":
        return "Suppliers";
      default:
        if (location.pathname.startsWith("/change-item")) {
          return `Edit Item`;
        }
        if (location.pathname.startsWith("/edit-supplier")) {
          return `Edit Supplier`;
        }
        if (location.pathname.startsWith("/detail")) {
          return location.pathname.startsWith("/detail-supplier")
            ? "Detail Supplier"
            : "Detail Barang";
        }
        return "Page";
    }
  };

  return (
    <header className="h-20 shadow-lg flex items-center justify-between px-4 md:px-10 bg-gray-100">
      <h1 className="text-2xl md:text-4xl font-bold">{getTitle()}</h1>
      <DropdownUser />
    </header>
  );
};

export default Header;
