import { createContext, ReactNode, useContext, useState } from "react";

type User = { id: string; email: string } | null;
type AuthContextValue = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  async function login(email: string, _password: string) {
    setUser({ id: "demo", email });
  }
  async function register(email: string, _password: string) {
    setUser({ id: "demo", email });
  }
  async function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
