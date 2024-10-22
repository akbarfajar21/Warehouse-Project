// AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import { supabase } from "../utils/SupaClient";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

const logout = () => supabase.auth.signOut();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;

      setUser(currentUser ?? null);
      setAuth(currentUser ? true : false);

      if (currentUser) {
        getDataUser(currentUser.id);
      } else {
        console.log("data user tidak tersedia");
      }
      setLoading(false);
    };

    getUser();

    const getDataUser = async (userId) => {
      try {
        const { data: userData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId);

        setUsername(userData[0].username);
        setAvatar(userData[0].avatar_url);
        setEmail(userData[0].email);
        setRole(userData[0].role);
      } catch (error) {
        console.log(error);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAuth(false);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, user, role, username, avatar, auth, loading, email }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
