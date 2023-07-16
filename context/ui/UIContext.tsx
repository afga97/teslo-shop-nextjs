import { createContext } from 'react'

export interface ContextProps {
  sidemenuOpen: boolean

  // Methods
  sideMenuToggle: (isOpen: boolean) => void
}
export const UIContext = createContext({} as ContextProps)