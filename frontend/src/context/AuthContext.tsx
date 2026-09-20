import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  removeToken,
  registerUser,
  saveToken,
  type User,
} from "../services/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    const hasToken =
      localStorage.getItem(
        "paird_access_token"
      );

    if (hasToken) {
      restoreSession();
    } else {
      setLoading(false);
    }
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    const token = await loginUser({
      email,
      password,
    });

    saveToken(token);

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    await registerUser({
      name,
      email,
      password,
    });
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}