import { IUser } from "../../interfaces";
import { STATE_AUTH } from "./";

type AUTH_ACTIONS =
  | { type: "[Auth] Login", payload: { user: IUser, isLoggedIn: boolean } }
  | { type: "[Auth] Register", payload: { user: IUser, isLoggedIn: boolean } }
  | { type: "[Auth] Logout" };

export const authReducer = (state: STATE_AUTH, action: AUTH_ACTIONS): STATE_AUTH => {
  switch (action.type) {
    case "[Auth] Login":
      return { ...state, user: action.payload.user, isLoggedIn: action.payload.isLoggedIn}
    case "[Auth] Register":
      return { ...state, user: action.payload.user, isLoggedIn: action.payload.isLoggedIn }
      case "[Auth] Logout":
        return { ...state, user: undefined, isLoggedIn: false }
    default:
      return state;
  }
};
