import React, { useState, useEffect } from "react";
import DropdownUser from "./nextui/DropdownUser";
import { useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

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
      case "/add-supplier":
        return "Tambah Supplier";
      case "/profiles":
        return "Profiles";
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
    <header className="h-20 shadow-lg flex items-center justify-between px-4 md:px-10 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
        {getTitle()}
      </h1>
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        <DropdownUser />
      </div>
    </header>
  );
};

export default Header;
