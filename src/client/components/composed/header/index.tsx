import * as React from "react";
import { useWindowScroll } from "react-use";

import { Button, Box, Container, Theme, fade } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Logo } from "@/client/assets/logo";
import { useLoggedQuery } from "@/client/graphql";

import { Blurred, Spacer } from "../../layout";
import { PreloadLink } from "../../typography/preload-link";

const useStyles = makeStyles((theme: Theme) => ({
  topbar: {
    backgroundColor: fade(theme.palette.background.default, 0.6),
  },
}));

export function Header() {
  const { data } = useLoggedQuery();
  const { y } = useWindowScroll();
  const classes = useStyles();

  return (
    <Box position="sticky" top={0} width="100%" className={classes.topbar}>
      <Blurred border={y !== 0}>
        <Container maxWidth="md">
          <Box display="flex" alignItems="center" py={2}>
            <Box flex="1">
              <PreloadLink to="/">
                <Logo height={35} />
              </PreloadLink>
            </Box>
            <Box>
              {data?.logged ? (
                <Button component={PreloadLink} color="secondary" variant="contained" to="/app/:condominium">
                  Abrir
                </Button>
              ) : (
                <Spacer>
                  <Button component={PreloadLink} color="secondary" variant="text" to="/auth/signin">
                    Entrar
                  </Button>
                  <Button component={PreloadLink} color="secondary" variant="contained" to="/auth/signup/step-1">
                    Cadastre-se
                  </Button>
                </Spacer>
              )}
            </Box>
          </Box>
        </Container>
      </Blurred>
    </Box>
  );
}
