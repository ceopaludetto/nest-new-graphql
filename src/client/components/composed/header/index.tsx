import * as React from "react";
import { useWindowScroll } from "react-use";

import { Button, Box, Container } from "@material-ui/core";

import { Logo } from "@/client/assets/logo";
import { useLoggedQuery } from "@/client/graphql";

import { Blurred, Spacer } from "../../layout";
import { PreloadLink } from "../../typography/preload-link";

export function Header() {
  const { data } = useLoggedQuery();
  const { y } = useWindowScroll();

  return (
    <Box position="fixed" width="100%">
      <Blurred border={y !== 0}>
        <Container>
          <Box display="flex" alignItems="center" py={2}>
            <Box flex="1">
              <PreloadLink to="/">
                <Logo height={35} />
              </PreloadLink>
            </Box>
            <Box>
              {data?.logged ? (
                <Button component={PreloadLink} color="primary" variant="text" to="/app/:condominium">
                  Abrir
                </Button>
              ) : (
                <Spacer>
                  <Button component={PreloadLink} color="primary" variant="text" to="/auth/signin">
                    Entrar
                  </Button>
                  <Button component={PreloadLink} color="primary" variant="contained" to="/auth/signup/step-1">
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
