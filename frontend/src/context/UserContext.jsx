import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // login function
  const login = async ({ email, password }) => {
    try {
      const { data } = await axios.post("/api/users/login", { email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // register function
  const register = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post("/api/users/register", { name, email, password });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // fetchProfile: get user from backend using token
  const fetchProfile = async () => {
    if (!user?.token) return null;
    try {
      const { data } = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUser((prev) => ({ ...prev, ...data })); // merge profile info
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch profile");
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};