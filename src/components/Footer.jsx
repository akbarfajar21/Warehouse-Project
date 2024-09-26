import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 px-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left mb-2 md:mb-0">
          © 2024 Warehouse Rabbaanii. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
