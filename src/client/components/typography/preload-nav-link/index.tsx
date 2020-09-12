import * as React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

import { usePreload, usePathWithCondominium } from "@/client/hooks";
import { hasPathname } from "@/client/utils/string";

interface PreloadLinkProps extends NavLinkProps {
  to: { pathname: string } | string;
  params?: Record<string, any>;
}

export const PreloadNavLink = React.forwardRef<HTMLAnchorElement, PreloadLinkProps>(
  ({ to, params, children, onClick, ...rest }, ref) => {
    const [generatePath] = usePathWithCondominium();
    const resolvedTo = hasPathname(to) ? to.pathname : to;
    const path = generatePath(resolvedTo);
    const [handleClick] = usePreload(onClick);

    return (
      <NavLink ref={ref} to={path} onClick={handleClick(path)} {...rest}>
        {children}
      </NavLink>
    );
  }
);
