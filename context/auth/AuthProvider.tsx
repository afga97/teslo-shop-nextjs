import { FC, useReducer, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"
import Cookies from "js-cookie";
import axios from "axios";
import { tesloClientApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface STATE_AUTH {
  isLoggedIn: boolean;
  user?: IUser;
}

export const INITIAL_STATE_AUTH: STATE_AUTH = {
  user: undefined,
  isLoggedIn: false,
};

export const AuthProvider: FC<{ children: JSX.Element }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE_AUTH);

  const { data, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      // console.log(data);
      dispatch({ type: "[Auth] Login", payload: { user: {...data?.user as IUser }, isLoggedIn: true } });
    }
  }, [status, data])
  

  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {
    if (!Cookies.get('token')) return
    try {
      const { data } = await tesloClientApi.get("/user/valid-token")
      const { token, user } = data
      Cookies.set('token', token)
      dispatch({ type: "[Auth] Login", payload: { user, isLoggedIn: true } });
    } catch (error) {
      Cookies.remove('token')
    }
    
  }
  

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloClientApi.post("/user/login", {
        email,
        password,
      });
      const { user, token } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] Login", payload: { user, isLoggedIn: true } });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    email: string,
    name: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloClientApi.post("/user/register", {
        email,
        password,
        name,
      });
      const { user, token } = data;
      Cookies.set("token", token);
      dispatch({
        type: "[Auth] Register",
        payload: { user, isLoggedIn: true },
      });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "No se pudo crear el usuario, intente nuevamente",
      };
    }
  };

  const logOut = async () => {
    // Cookies.remove("token");
    Cookies.remove("cart");
    Cookies.remove('address')
    Cookies.remove('address2')
    Cookies.remove('city')
    Cookies.remove('country')
    Cookies.remove('firstName')
    Cookies.remove('lastName')
    Cookies.remove('phone')
    Cookies.remove('zip')
    await signOut()
    // dispatch({ type: "[Auth] Logout" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        loginUser,
        registerUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
