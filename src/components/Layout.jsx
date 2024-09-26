import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <main className="flex flex-col min-h-screen md:flex-row w-full">
      <Sidebar />
      <div className="flex flex-col w-full md:w-4/5">
        <Header />
        <div className="flex-grow p-4">{children}</div>
        <Footer /> 
      </div>
    </main>
  );
};

export default Layout;
