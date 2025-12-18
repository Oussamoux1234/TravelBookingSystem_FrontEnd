import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '@/lib/api';

// User type from backend
interface User {
  id: number;
  name: string;
  email: string;
}

// Auth response from backend
interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });

    // Store token and user
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: response.userId,
      name: response.name,
      email: response.email,
    }));

    setToken(response.token);
    setUser({
      id: response.userId,
      name: response.name,
      email: response.email,
    });
    setAuthToken(response.token);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });

    // Store token and user
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: response.userId,
      name: response.name,
      email: response.email,
    }));

    setToken(response.token);
    setUser({
      id: response.userId,
      name: response.name,
      email: response.email,
    });
    setAuthToken(response.token);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

