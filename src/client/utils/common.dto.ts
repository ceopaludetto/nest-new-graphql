import type { RouteProps, RouteComponentProps as DefaultRouteComponentProps } from "react-router-dom";

import type { ApolloClient } from "@apollo/client";
import type { LoadableComponent } from "@loadable/component";

export type Client = ApolloClient<Record<string, any>>;

export type Route = Omit<RouteProps, "component" | "render"> & {
  name: string;
  children?: Route[];
  component: LoadableComponent<any> & { fetchBefore?: (client: Client) => Promise<void> };
  meta?: Record<string, any>;
  render?: (custom: any) => RouteProps["render"];
};

export interface ReactStaticContext {
  url?: string;
  statusCode?: number;
}

export type RouteComponentProps = {
  routes?: Route[];
} & DefaultRouteComponentProps<Record<string, any>, ReactStaticContext>;

export type IsomorphicLib<T> = { default: T } | T;

export interface Locale {
  name: string;
  weekdays?: string[];
  months?: string[];
  weekStart?: number;
  weekdaysShort?: string[];
  monthsShort?: string[];
  weekdaysMin?: string[];
  ordinal?: (n: number) => number | string;
  formats: Partial<{
    LT: string;
    LTS: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
  }>;
  relativeTime: Partial<{
    future: string;
    past: string;
    s: string;
    m: string;
    mm: string;
    h: string;
    hh: string;
    d: string;
    dd: string;
    M: string;
    MM: string;
    y: string;
    yy: string;
  }>;
}

export type PropsOf<
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

export enum Gender {
  M = "M",
  F = "F",
  N = "N",
}

export type ColorMode = "dark" | "light";
