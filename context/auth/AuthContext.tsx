import { createContext } from "react";
import { IUser } from "../../interfaces";

interface ContextDataAuth {
  isLoggedIn: boolean;
  user?: IUser;

  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    email: string,
    name: string,
    password: string
  ) => Promise<{ hasError: boolean; message?: string }>;
  logOut: () => void;
}

export const AuthContext = createContext({} as ContextDataAuth);
