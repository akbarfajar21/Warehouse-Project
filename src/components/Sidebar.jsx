import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden p-4 text-white bg-blue-900"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M6 18L18 6M6 6l12 12"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" />
          </svg>
        )}
      </button>
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } md:block md:w-1/5 w-full bg-blue-900 text-white h-full md:h-auto fixed md:relative z-50`}
      >
        <div className="h-20 shadow-lg flex justify-between items-center px-4">
          <h2 className="flex items-center text-2xl font-bold gap-1">
            RB Market
          </h2>
          {/* Close button (X) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav className="flex justify-center pt-10">
          <ul className="flex flex-col gap-8">
            <li>
              <LinkSidebar link={"/"}>
                <DashboardIcon /> Dashboard
              </LinkSidebar>
            </li>
            <li>
              <LinkSidebar link={"/table"}>
                <TableIcon /> Tabel Barang
              </LinkSidebar>
            </li>
            <li>
              <LinkSidebar link={"/all-barang"}>
                <ItemsIcon /> Semua Barang
              </LinkSidebar>
            </li>
            <li>
              <LinkSidebar link={"/suppliers"}>
                <SupplierIcon /> Supplier
              </LinkSidebar>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

const LinkSidebar = ({ link, children }) => {
  const location = useLocation();

  return (
    <Link
      to={link}
      className={`${
        location.pathname === link ? "text-yellow-400" : ""
      } flex items-center gap-2 text-xl`}
    >
      {children}
    </Link>
  );
};

// Icons (unchanged)
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20zm-5.6-4.29a9.95 9.95 0 0 1 11.2 0a8 8 0 1 0-11.2 0zm6.12-7.64l3.02-3.02l1.41 1.41l-3.02 3.02a2 2 0 1 1-1.41-1.41z"
    />
  </svg>
);

const TableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M3 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm5 2v3H4V5zm-4 9v-4h4v4zm0 2h4v3H4zm6 0h10v3H10zm10-2H10v-4h10zm0-9v3H10V5z"
    />
  </svg>
);

const ItemsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21ZM7.1 13.45l1.8-.9l-2-4l-1.8.9l2 4ZM9.5 18h2v-7.244L9.4 6.55l-1.8.9l1.9 3.8V18Zm3 0h2v-6.756l1.9-3.794l-1.8-.9l-2.1 4.2V18Zm4.4-4.55l2-4l-1.8-.9l-2 4l1.8.9Z"
    />
  </svg>
);

const SupplierIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 2a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5zm0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10h12v11H6V10zm4-8a7 7 0 0 1 7 7v4a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7zm-1 11h2v-4h-2v4z"
    />
  </svg>
);

export default Sidebar;
