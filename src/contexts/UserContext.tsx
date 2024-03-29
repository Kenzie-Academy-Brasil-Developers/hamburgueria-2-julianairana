import { createContext, useState } from "react";
import { iRegisterForm } from "../pages/ResgisterPage";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { iLoginForm } from "../pages/LoginPage";

export interface iRegisterUserResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface iUserContext {
  user: iRegisterUserResponse | null;
  setUser: React.Dispatch<React.SetStateAction<iRegisterUserResponse | null>>;
  RegisterUser: (
    data: iRegisterForm,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;

  LoginUser: (
    data: iLoginForm,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  newLoading: boolean;
  setNewLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext({} as iUserContext);

interface iUserProviderProps {
  children: React.ReactNode;
}

interface iDataToRegister {
  name: string;
  email: string;
  password: string;
}

interface iDataToLogin {
  email: string;
  password: string;
}

export function UserProvider({ children }: iUserProviderProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<iRegisterUserResponse | null>(null);
  const [newLoading, setNewLoading] = useState(true);
  const navigate = useNavigate();

  async function LoginUser  ( data: iDataToLogin,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
    try {
      setLoading(true);
      const response = await api.post<iRegisterUserResponse>("/login", data);
      localStorage.setItem("@TOKEN", response.data.accessToken);
      setUser(response.data);
      toast.success("Login realizado com sucesso!");
      api.defaults.headers.authorization = `Bearer ${response.data.accessToken}`;

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      toast.error("Login não realizado!");
    } finally {
      setLoading(false);
    }
  };

  async function RegisterUser(
    data: iDataToRegister,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    try {
      setLoading(true);
      await api.post<iRegisterUserResponse>("/users", data);
      toast.success("Cadastro relizado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      toast.error("Usuário já cadastrado!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        RegisterUser,
        newLoading,
        setNewLoading,
        LoginUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
