import * as React from "react";
import { HelmetProps, Helmet } from "react-helmet-async";

import { Typography, Container, Box } from "@material-ui/core";

interface PageProps extends React.ComponentProps<typeof Container> {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  helmetProps?: HelmetProps;
  helmet?: React.ReactNode;
  footer?: React.ReactNode;
  tabs?: React.ReactNode;
}

export function Page({ title, subtitle, children, actions, helmet, helmetProps, footer, tabs, ...rest }: PageProps) {
  return (
    <>
      {helmet || (helmetProps && <Helmet {...helmetProps}>{helmet}</Helmet>)}
      <Container {...rest}>
        <Box display="flex" mb={tabs ? 2 : 4} mt={3} alignItems="center" flexWrap="wrap">
          <Box flex={{ xs: "1" }}>
            <Typography variant="subtitle1" component="span" color="primary">
              {subtitle}
            </Typography>
            <Typography variant="h4" component="h1" color="textPrimary">
              {title}
            </Typography>
          </Box>
          {actions && <Box>{actions}</Box>}
          {footer && (
            <Box mt={2} flex="0 0 100%">
              {footer}
            </Box>
          )}
        </Box>
        {!!tabs && (
          <Box position="sticky" bgcolor="background.default" zIndex={3000} mt={2} mb={4} mx={-3} px={3} top={0}>
            {tabs}
          </Box>
        )}
        {children}
      </Container>
    </>
  );
}
