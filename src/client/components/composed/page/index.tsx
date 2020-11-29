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
}

export function Page({ title, subtitle, children, actions, helmet, helmetProps, footer, ...rest }: PageProps) {
  return (
    <>
      {helmet || (helmetProps && <Helmet {...helmetProps}>{helmet}</Helmet>)}
      <Container {...rest}>
        <Box display="flex" mb={4} mt={3} alignItems="center" flexWrap="wrap">
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
        {children}
      </Container>
    </>
  );
}
