import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { UserProfile, mockUser, mockStartupUser } from "@/data/mockData";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: "startup" | "investor") => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: "startup" | "investor") => void;
  pendingRole: "startup" | "investor" | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState<"startup" | "investor" | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("winvesty_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, _password: string) => {
    const profile: UserProfile =
      email.toLowerCase().includes("startup") ? mockStartupUser : mockUser;
    await AsyncStorage.setItem("winvesty_user", JSON.stringify(profile));
    setUser(profile);
  };

  const register = async (name: string, email: string, _password: string, role: "startup" | "investor") => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      role: role === "investor" ? "investor_pending" : "startup",
    };
    await AsyncStorage.setItem("winvesty_user", JSON.stringify(profile));
    setUser(profile);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("winvesty_user");
    setUser(null);
  };

  const setRole = (role: "startup" | "investor") => {
    setPendingRole(role);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setRole, pendingRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
