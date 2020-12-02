import * as React from "react";
import { Helmet } from "react-helmet-async";

import { withStyles } from "@material-ui/styles";

import Poppins300 from "@/client/assets/fonts/poppins-300.woff2";
import Poppins400 from "@/client/assets/fonts/poppins-400.woff2";
import Poppins500 from "@/client/assets/fonts/poppins-500.woff2";
import Poppins600 from "@/client/assets/fonts/poppins-600.woff2";

function GlobalComponent() {
  return (
    <>
      <Helmet>
        <link rel="preload" href={Poppins300} as="font" crossOrigin="anonymous" />
        <link rel="preload" href={Poppins400} as="font" crossOrigin="anonymous" />
        <link rel="preload" href={Poppins500} as="font" crossOrigin="anonymous" />
        <link rel="preload" href={Poppins600} as="font" crossOrigin="anonymous" />
      </Helmet>
    </>
  );
}

export const Global = withStyles({
  "@global": {
    "@font-face": [
      {
        fontDisplay: "swap",
        fontFamily: "Poppins",
        fontWeight: 300,
        fontStyle: "normal",
        src: `local("Poppins Light"), local("Poppins-Light"), url(${Poppins300}) format("woff2")`,
      },
      {
        fontDisplay: "swap",
        fontFamily: "Poppins",
        fontWeight: 400,
        fontStyle: "normal",
        src: `local("Poppins Regular"), local("Poppins-Regular"), url(${Poppins400}) format("woff2")`,
      },
      {
        fontDisplay: "swap",
        fontFamily: "Poppins",
        fontWeight: 500,
        fontStyle: "normal",
        src: `local("Poppins Medium"), local("Poppins-Medium"), url(${Poppins500}) format("woff2")`,
      },
      {
        fontDisplay: "swap",
        fontFamily: "Poppins",
        fontWeight: 600,
        fontStyle: "normal",
        src: `local("Poppins Bold"), local("Poppins-Bold"), url(${Poppins600}) format("woff2")`,
      },
    ] as any,
  },
})(GlobalComponent);
