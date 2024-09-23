import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <main className="flex flex-col md:flex-row w-full">
      <Sidebar />
      <div className="flex flex-col w-full md:w-4/5">
        <Header />
        <div className="p-4">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
