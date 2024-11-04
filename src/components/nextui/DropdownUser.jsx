import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function DropdownUser() {
  const { username, avatar, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Successful!",
      text: "You have successfully logged out.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      logout();
      window.location.href = "/";
    });
  };

  return (
    <div className="flex items-center gap-4">
      {username ? (
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: avatar ? avatar : "",
              }}
              className="transition-transform"
              description={<span className="hidden sm:inline">@{email}</span>}
              name={username}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-20 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@{username}</p>
            </DropdownItem>
            <DropdownItem color="warning">
              <Link to="/profiles">Profiles</Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <Link to="/login">
          <button className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}
