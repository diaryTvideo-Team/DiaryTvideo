"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { logout as authLogout } from "@/lib/auth-store";
import { getMe } from "@/lib/user-store";
import { hasTokens } from "@/lib/api/token";
import { AuthUser } from "@repo/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreUser() {
      if (!hasTokens()) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMe();
        if (response.data) {
          setUser({
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            emailVerified: response.data.emailVerified,
          });
        }
      } catch {
        // 토큰이 만료되었거나 유효하지 않음
      } finally {
        setIsLoading(false);
      }
    }

    restoreUser();
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
