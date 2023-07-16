import { FC, useReducer } from "react";
import { UIContext } from ".";
import { uiReducer } from "./";

export interface UIState {
  sidemenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  sidemenuOpen: false,
};

export const UIProvider: FC<{ children: JSX.Element }> = ({ children }) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

  const sideMenuToggle = (isOpen: boolean) => {
    dispatch({ type: 'UI - Toggle Menu', payload: isOpen })
  }

  return (
    <UIContext.Provider
      value={{ 
        ...state,
        sideMenuToggle
      }}
    >
      {children}
    </UIContext.Provider>
    )
};
