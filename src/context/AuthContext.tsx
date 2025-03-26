
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
  redirectToLogin: () => void;
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
            setUser({
              id: currentUser.id || currentUser._id || '',
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone,
              isReferred: currentUser.isReferred,
              referredBy: currentUser.referredBy
            });
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
      setUser({
        id: authUser.id || authUser._id || '',
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone,
        isReferred: authUser.isReferred,
        referredBy: authUser.referredBy
      });
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

  // Helper function to redirect to login page
  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout, redirectToLogin }}>
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
