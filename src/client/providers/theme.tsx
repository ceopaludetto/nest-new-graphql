import * as React from "react";

import { Theme, createMuiTheme } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";

import type { ColorMode } from "@/client/utils/common.dto";

const darkVariant: Partial<Theme["palette"]> = {
  type: "dark",
  primary: {
    light: "#c3fdff",
    main: "#90caf9",
    dark: "#5d99c6",
    contrastText: "#000000",
  },
  secondary: {
    light: "#ffffff",
    main: "#fafafa",
    dark: "#c7c7c7",
    contrastText: "#000000",
  },
  error: {
    light: "#ff8e98",
    main: "#ff5a6a",
    dark: "#c61f40",
    contrastText: "#000000",
  },
  success: {
    light: "#f5ffec",
    main: "#c2eaba",
    dark: "#91b88a",
    contrastText: "#000000",
  },
  background: {
    default: "#1b1b1b",
    paper: "#252525",
  },
};

const lightVariant: Partial<Theme["palette"]> = {
  type: "light",
  primary: {
    light: "#63a4ff",
    main: "#1976d2",
    dark: "#5d99c6",
    contrastText: "#FFFFFF",
  },
  secondary: {
    light: "#404040",
    main: "#1a1a1a",
    dark: "#000000",
    contrastText: "#FFFFFF",
  },
  error: {
    light: "#ff838c",
    main: "#e1515f",
    dark: "#aa1835",
    contrastText: "#000000",
  },
  success: {
    light: "#8cdb78",
    main: "#5aa94a",
    dark: "#26791c",
    contrastText: "#000000",
  },
  background: {
    default: "#fff",
    paper: "#f2f2f2",
  },
};

const createTheme = (mode: "dark" | "light" = "dark") =>
  createMuiTheme({
    palette: mode === "dark" ? darkVariant : lightVariant,
    shape: {
      borderRadius: 6,
    },
    typography: {
      fontFamily: "Poppins",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
    },
    props: {
      MuiFormControl: {
        variant: "outlined",
      },
      MuiFormHelperText: {
        variant: "outlined",
      },
      MuiSelect: {
        variant: "outlined",
      },
      MuiInputLabel: {
        variant: "outlined",
      },
      MuiTextField: {
        variant: "outlined",
        fullWidth: true,
      },
      MuiButton: {
        disableElevation: true,
      },
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: "none",
        },
      },
      MuiPaper: {
        outlined: {
          backgroundColor: "transparent",
        },
      },
      MuiStepper: {
        root: {
          backgroundColor: "transparent",
          paddingLeft: "0",
          paddingRight: "0",
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: "36px",
        },
      },
      MuiTab: {
        root: {
          fontSize: "0.975rem",
          textTransform: "none",
        },
      },
      MuiOutlinedInput: {
        notchedOutline: {
          transition: "border 150ms ease-in-out",
        },
      },
    },
  });

interface ThemeProviderProps {
  cookies: string;
  children: React.ReactNode;
}

const cookieStorageManager = (cookies = "", storageKey: string) => ({
  get(init: "dark" | "light") {
    const match = cookies.match(new RegExp(`(^| )${storageKey}=([^;]+)`));

    if (match) {
      return match[2] as "dark" | "light";
    }

    return init;
  },
  set(value: "dark" | "light") {
    document.cookie = `${storageKey}=${value}; MaxAge=31536000; Path=/; SameSite=Strict`;
  },
});

interface ThemeContextProps {
  theme: ReturnType<typeof createTheme>;
  colorMode: ColorMode;
  changeColorMode: (colorMode?: ColorMode) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: {} as any,
  colorMode: "dark",
  changeColorMode: (colorMode?: "dark" | "light") => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export function ThemeProvider({ children, cookies }: ThemeProviderProps) {
  const manager = React.useRef(cookieStorageManager(cookies, "@Domus")).current;
  const [colorMode, setColorMode] = React.useState(manager.get("dark"));
  const [theme, setTheme] = React.useState(createTheme(colorMode));

  const changeColorMode = React.useCallback((newColorMode?: ColorMode) => {
    setColorMode((current) => {
      if (newColorMode) {
        return newColorMode;
      }

      return current === "dark" ? "light" : "dark";
    });
  }, []);

  React.useEffect(() => {
    manager.set(colorMode);
    setTheme(createTheme(colorMode));
  }, [manager, colorMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme, colorMode, changeColorMode }}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  );
}
