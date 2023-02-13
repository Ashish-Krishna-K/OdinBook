import { createContext } from "react";

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme) => theme,
});

export const CurrentUserContext = createContext(null);
