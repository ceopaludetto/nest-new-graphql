import * as React from "react";
import { Link } from "react-router-dom";

import { usePreload } from "@/client/hooks";

const hasPathname = (to: { pathname: string } | string): to is { pathname: string } => typeof to !== "string";

type PreloadLinkProps<T extends React.ElementType<any> = Link> = {
  as?: T;
  to: { pathname: string } | string;
} & React.ComponentProps<T>;

export function PreloadLink<T extends React.ComponentType<any> = Link>({
  to,
  children,
  onClick,
  as: Component = Link,
  ...rest
}: PreloadLinkProps<T>) {
  const path = hasPathname(to) ? to.pathname : to;
  const [handleClick] = usePreload<T>(onClick);

  return (
    <Component onClick={handleClick(path)} {...rest}>
      {children}
    </Component>
  );
}
