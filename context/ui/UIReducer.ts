import { UIState } from "./";

type UIActionType =
  | { type: "UI - Toggle Menu", payload: boolean }

export const uiReducer = (state: UIState, action: UIActionType): UIState => {
  switch (action.type) {
    case "UI - Toggle Menu":
      return {
        ...state,
        sidemenuOpen: action.payload,
      };
    
    default:
      return state;
  }
};
