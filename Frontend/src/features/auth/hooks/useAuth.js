import { useContext } from "react";

import { register, login, logout, getMe } from "../services/auth.api";
import { AuthContext } from "../services/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const response = await register(userData);
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    try {
      const response = await login(userData);
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logout();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    try {
      const response = await getMe();
      setUser(response.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe,
  };
};
