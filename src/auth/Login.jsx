import React, { useState } from "react";
import { supabase } from "../utils/SupaClient";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Periksa kembali email dan password Anda.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (data) {
        Swal.fire({
          title: "Login Berhasil!",
          text: "Selamat datang kembali!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-md rounded-lg  dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login Page</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white "
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
