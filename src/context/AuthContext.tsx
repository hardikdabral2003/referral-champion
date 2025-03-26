
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isReferred?: boolean;
  referredBy?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get token from local storage (set by api.login)
        const token = api.initAuth();
        
        if (token) {
          // Fetch current user
          const currentUser = await api.getCurrentUser();
          if (currentUser) {
            setUser(currentUser as User);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // If token is invalid, remove it
        api.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: authUser } = await api.login(email, password);
      setUser(authUser);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${authUser.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
