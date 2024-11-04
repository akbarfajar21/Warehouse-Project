import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../utils/SupaClient";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ClipLoader from "react-spinners/ClipLoader"; 

export default function Profiles() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setUsername(data.username);
      setFullName(data.full_name);
      setAvatarUrl(data.avatar_url);
      setEmail(data.email);
      setNoTelepon(data.no_telepon);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username, full_name: fullName, email, no_telepon: noTelepon }) 
        .eq("id", user.id);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully!",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleEditAvatar = async () => {
    try {
      const file = await new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => resolve(input.files[0]);
        input.click();
      });

      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload the file to storage.");
      }

      const { data, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("URL error:", urlError);
        throw new Error("Failed to get public URL of the uploaded file.");
      }

      const newAvatarUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error("Failed to update avatar URL in the database.");
      }

      if (avatarUrl && avatarUrl !== "https://via.placeholder.com/150") {
        const oldFileName = avatarUrl.split("/").pop();
        const oldFilePath = `avatars/${oldFileName}`;

        console.log("Attempting to delete old avatar at:", oldFilePath);

        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldFilePath]);

        if (deleteError) {
          console.error("Delete error:", deleteError);
          throw new Error("Failed to delete the old avatar from storage.");
        } else {
          console.log("Old avatar deleted successfully.");
        }
      }

      setAvatarUrl(newAvatarUrl);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Avatar updated successfully!",
      }).then(() => {
        window.location.reload(); 
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader loading={loading} size={50} color="#4A5568" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6">
        <div className="relative mb-4">
          <img
            src={avatarUrl || "https://via.placeholder.com/150"}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover mb-2"
          />
          <button
            className="absolute bottom-1 left-24 transform -translate-x-1/2 bg-gray-800 p-1 rounded-full"
            onClick={handleEditAvatar}
          >
            <PencilIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        <div className="mb-4 w-full">
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block font-semibold mb-1">No Telepon</label>
          <input
            type="tel"
            value={noTelepon}
            onChange={(e) => setNoTelepon(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="bg-indigo-600 text-white py-2 px-4 rounded mt-4 w-full"
        >
          Update Profile
        </button>
      </div>
    </Layout>
  );
}
