import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Switch, Route } from "react-router-dom";
import { useToggle } from "react-use";

import OpenSans400 from "@/client/assets/fonts/open-sans-400.woff2";
import OpenSans600 from "@/client/assets/fonts/open-sans-600.woff2";
import { ProgressBar } from "@/client/components";
import { ProgressContext } from "@/client/providers/progress";
import { routes } from "@/client/providers/routes";

import "@/client/styles/normalize.scss";

export function App() {
  const [isAnimating, toggle] = useToggle(false);

  return (
    <ProgressContext.Provider value={{ isAnimating, toggle }}>
      <ProgressBar />
      <Helmet htmlAttributes={{ lang: "pt-BR" }} defaultTitle="Domus" titleTemplate="%s | Domus">
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Testing my all learned skills in web development" />
        <link rel="preload" href={OpenSans400} as="font" crossOrigin="anonymous" />
        <link rel="preload" href={OpenSans600} as="font" crossOrigin="anonymous" />
      </Helmet>
      <Switch>
        {routes.map(({ name, component: Component, children, ...rest }) => (
          <Route key={name} render={(props) => <Component {...props} routes={children} />} {...rest} />
        ))}
      </Switch>
    </ProgressContext.Provider>
  );
}
