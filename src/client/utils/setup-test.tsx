/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/extend-expect";
import type { FunctionComponent, ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

import { render } from "@testing-library/react";

import { ThemeProvider } from "@/client/providers/theme";

interface AllProvidersProps {
  children?: ReactNode;
}

const AllProviders: FunctionComponent<AllProvidersProps> = ({ children }) => (
  <HelmetProvider>
    <MemoryRouter>
      <ThemeProvider cookies="">{children}</ThemeProvider>
    </MemoryRouter>
  </HelmetProvider>
);

type RenderParameters = Parameters<typeof render>;

const customRender = (ui: RenderParameters[0], options?: RenderParameters[1]) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
