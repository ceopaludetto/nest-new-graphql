import * as React from "react";

import type { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

interface BlurredProps extends React.HTMLAttributes<HTMLDivElement> {
  deactivate?: boolean;
  border?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backdropFilter: "saturate(100%) blur(5px)",
    borderBottom: "1px solid transparent",
  },
  border: {
    borderBottomColor: theme.palette.divider,
  },
}));

export function Blurred({ className, children, border = false, ...rest }: BlurredProps) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, border && classes.border, className)} {...rest}>
      {children}
    </div>
  );
}
