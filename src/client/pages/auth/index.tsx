import * as React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import { Paper, Box, Container, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { Footer } from "@/client/components";
import type { RouteComponentProps } from "@/client/utils/common.dto";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "grid",
    height: "100vh",
    placeItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  paper: {},
  register: {
    "@media (max-width: 900px)": {
      placeItems: "start",
      height: "auto",
      "& $paper": {
        borderColor: "transparent",
      },
    },
  },
  notRegister: {
    "@media (max-width: 550px)": {
      placeItems: "start",
      height: "auto",
      "& $paper": {
        borderColor: "transparent",
      },
    },
  },
}));

export default function Auth({ routes }: RouteComponentProps) {
  const isRegister = useRouteMatch("/auth/signup");
  const classes = useStyles();

  return (
    <>
      <Container className={clsx(classes.container, isRegister ? classes.register : classes.notRegister)}>
        <Box width="100%" maxWidth={isRegister ? "900px" : "550px"}>
          <Box clone p={5.5}>
            <Paper className={classes.paper} variant="outlined">
              <Switch>
                {routes?.map(({ name, component: Component, children, ...rest }) => (
                  <Route key={name} render={(props) => <Component {...props} routes={children} />} {...rest} />
                ))}
              </Switch>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
