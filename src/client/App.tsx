import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Switch, Route, Redirect } from "react-router-dom";
import { useToggle } from "react-use";

import DayJSUtilsProvider from "@date-io/dayjs";
import { CssBaseline } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { ProgressBar, Global } from "@/client/components";
import { useLoggedQuery } from "@/client/graphql";
import { usePathWithCondominium } from "@/client/hooks";
import { ProgressContext } from "@/client/providers/progress";
import { routes } from "@/client/providers/routes";
import { ThemeProvider } from "@/client/providers/theme";
import { shouldRenderByAuth } from "@/client/utils/guards";

interface AppProps {
  logged?: boolean;
  cookies: string;
}

export function App({ logged, cookies }: AppProps) {
  const [isAnimating, toggle] = useToggle(false);
  const { data } = useLoggedQuery();
  const [generatePath] = usePathWithCondominium();

  return (
    <ThemeProvider cookies={cookies}>
      <MuiPickersUtilsProvider utils={DayJSUtilsProvider} locale="pt-BR">
        <ProgressContext.Provider value={{ isAnimating, toggle }}>
          <Helmet htmlAttributes={{ lang: "pt-BR" }} defaultTitle="Domus" titleTemplate="%s | Domus">
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Testing my all learned skills in web development" />
          </Helmet>
          <ProgressBar />
          <Global />
          <CssBaseline />
          <Switch>
            {routes.map(({ name, component: Component, children, meta, ...rest }) => (
              <Route
                key={name}
                render={(props) => {
                  if (shouldRenderByAuth(meta?.logged, data?.logged ?? logged)) {
                    return <Component {...props} routes={children} />;
                  }

                  const redirect = generatePath(meta?.redirectTo);

                  return <Redirect from={props.location.pathname} to={redirect} />;
                }}
                {...rest}
              />
            ))}
          </Switch>
        </ProgressContext.Provider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
