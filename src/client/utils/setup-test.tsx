import * as React from "react";
import "@testing-library/jest-dom/extend-expect";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

import { render } from "@testing-library/react";

import { ThemeProvider } from "@/client/providers/theme";

interface AllProvidersProps {
  children?: React.ReactNode;
}

const AllProviders: React.FunctionComponent<AllProvidersProps> = ({ children }) => {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <MemoryRouter>
          <ThemeProvider cookies="">{children}</ThemeProvider>
        </MemoryRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
};

type RenderParameters = Parameters<typeof render>;

const customRender = (ui: RenderParameters[0], options?: RenderParameters[1]) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
