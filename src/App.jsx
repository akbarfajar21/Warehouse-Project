import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TableBarang from "./pages/TableBarang";
import AllBarang from "./pages/AllBarang";
import ItemDetail from "./pages/item/ItemDetail";
import AddItems from "./pages/item/AddItems";
import ChangeItem from "./pages/item/ChangeItem";
import SupplierCRUD from "./pages/SupplierCRUD";
import AddSupplier from "./pages/item/AddSuppliers";
import ChangeSupplier from "./pages/item/ChangeSupplier";
import SupplierDetail from "./pages/item/SupplierDetail";
import Login from "./auth/Login";
import AuthAdmin from "./auth/AuthAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/suppliers" element={<SupplierCRUD />} />
        <Route path="/detail-supplier/:id" element={<SupplierDetail />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/table" element={<TableBarang />} />
        <Route path="/all-barang" element={<AllBarang />} />
        <Route path="/detail/:id" element={<ItemDetail />} />

        <Route element={<AuthAdmin />}>
          <Route path="/change-item/:id" element={<ChangeItem />} />
          <Route path="/edit-supplier/:id" element={<ChangeSupplier />} />
          <Route path="/add-items" element={<AddItems />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
