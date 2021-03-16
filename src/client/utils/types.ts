import type { ReactNode, FunctionComponent } from "react";
import type { RouteProps, RouteComponentProps as DefaultRouteComponentProps } from "react-router-dom";

import type { ApolloClient } from "@apollo/client";
import type { LoadableComponent } from "@loadable/component";

export type Client = ApolloClient<Record<string, any>>;

export type Route = Omit<RouteProps, "component" | "render"> & {
  name: string;
  children?: Route[];
  component: LoadableComponent<any> & {
    fetchBefore?: (client: Client) => Promise<void>;
  };
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

export type PropsOf<
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

export enum Gender {
  M = "M",
  F = "F",
  N = "N",
}

export type ColorMode = "dark" | "light";

export type Sidebar =
  | {
      type: "route";
      routeName: string;
    }
  | {
      type: "submenu";
      key: string;
      title: ReactNode;
      children?: Sidebar[];
      icon: FunctionComponent<any>;
    };
