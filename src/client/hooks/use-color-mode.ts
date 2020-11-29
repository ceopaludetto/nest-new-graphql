import * as React from "react";

import { ThemeContext } from "@/client/providers/theme";

export function useColorMode() {
  return React.useContext(ThemeContext);
}
