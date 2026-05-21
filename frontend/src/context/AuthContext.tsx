import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import api from "../api/axios";

interface User {
  name: string;
  email: string;
}

interface Website {
  id: string;
  title: string;
  businessName: string;
  businessType: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  websites: Website[];
  pagination: Pagination | null;
  websitesLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWebsites: (page: number) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  websitesFetched: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [websitesFetched, setWebsitesFetched] = useState(false); // cache flag

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (e) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Only fetch if not already fetched
  const fetchWebsites = useCallback(
    async (page: number) => {
      setWebsitesLoading(true);
      try {
        const res = await api.get(`/websites?page=${page}&limit=10`);
        setWebsites(res.data.websites);
        setPagination(res.data.pagination);
        setWebsitesFetched(true);
      } catch (e) {
        throw e;
      } finally {
        setWebsitesLoading(false);
      }
    },
    []
  );

  const deleteWebsite = useCallback(async (id: string) => {
    await api.delete(`/websites/${id}`);
    // Update local state immediately — no refetch needed
    setWebsites((prev) => prev.filter((w) => w.id !== id));
    setPagination((prev) =>
      prev ? { ...prev, total: prev.total - 1 } : prev
    );
  }, []);

  const signin = async (email: string, password: string) => {
    const res = await api.post("/auth/signin", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    await api.post("/auth/signup", { name, email, password });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setWebsites([]);
      setPagination(null);
      setWebsitesFetched(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        websites,
        pagination,
        websitesLoading,
        websitesFetched,
        signin,
        signup,
        logout,
        fetchWebsites,
        deleteWebsite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};