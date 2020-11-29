import * as React from "react";
import { AiOutlineTwitter, AiOutlineGithub } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";

import {
  Typography,
  Paper,
  Link,
  Container,
  IconButton,
  Box,
  Grid,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";

import { Logo } from "@/client/assets/logo";
import { Spacer } from "@/client/components/layout";
import { PreloadLink, Tooltip } from "@/client/components/typography";
import { useColorMode } from "@/client/hooks";
import { routes } from "@/client/providers/routes";
import type { Route } from "@/client/utils/common.dto";
import { retrieveTo } from "@/client/utils/string";

export function Footer() {
  const { current } = React.useRef(routes.find((r: Route) => r.name === "@MAIN"));
  const { current: company } = React.useRef(current?.children?.filter((r: Route) => r.meta?.type === "company"));
  const { current: resource } = React.useRef(current?.children?.filter((r: Route) => r.meta?.type === "resource"));
  const { current: legal } = React.useRef(current?.children?.filter((r: Route) => r.meta?.type === "legal"));
  const { colorMode, changeColorMode } = useColorMode();

  return (
    <footer>
      <Box clone borderLeft="0" borderRight="0" borderBottom="0">
        <Paper variant="outlined" square>
          <Box py={4}>
            <Container>
              <Grid container>
                <Grid item xs={12} md>
                  <Box mb={2}>
                    <Typography color="primary" gutterBottom variant="subtitle2">
                      Recursos
                    </Typography>
                  </Box>
                  {resource?.map((r) => (
                    <Box key={r.name} mb={1}>
                      <Link component={PreloadLink} to={retrieveTo(r.path)} color="textPrimary">
                        {r.meta?.displayName}
                      </Link>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md>
                  <Box mb={2}>
                    <Typography color="primary" gutterBottom variant="subtitle2">
                      Companhia
                    </Typography>
                  </Box>
                  {company?.map((r) => (
                    <Box key={r.name} mb={1}>
                      <Link component={PreloadLink} to={retrieveTo(r.path)} color="textPrimary">
                        {r.meta?.displayName}
                      </Link>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md>
                  <Box mb={2}>
                    <Typography color="primary" gutterBottom variant="subtitle2">
                      Legal
                    </Typography>
                  </Box>
                  {legal?.map((r) => (
                    <Box key={r.name} mb={1}>
                      <Link component={PreloadLink} to={retrieveTo(r.path)} color="textPrimary">
                        {r.meta?.displayName}
                      </Link>
                    </Box>
                  ))}
                </Grid>
              </Grid>
              <Box
                mt={4}
                display="flex"
                flexWrap="wrap"
                alignItems="flex-end"
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Box
                  mt={1}
                  mb={{ xs: 3, md: 0 }}
                  flex={{ xs: "0 0 100%", md: "1" }}
                  textAlign={{ xs: "center", md: "left" }}
                >
                  <PreloadLink to="/">
                    <Logo isLogoType height={40} />
                  </PreloadLink>
                  <Typography variant="body2">Copyright © 2020 Domus Inc. Todos direitos reservados.</Typography>
                </Box>
                <Box>
                  <Spacer display="flex" alignItems="center">
                    <Tooltip title="Github">
                      <IconButton color="primary" aria-label="Github">
                        <AiOutlineGithub />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Twitter">
                      <IconButton color="primary" aria-label="Github">
                        <AiOutlineTwitter />
                      </IconButton>
                    </Tooltip>
                    <Select
                      margin="dense"
                      value={colorMode}
                      startAdornment={
                        <InputAdornment position="start">
                          {colorMode === "dark" ? <FiMoon /> : <FiSun />}
                        </InputAdornment>
                      }
                      onChange={(e) => changeColorMode(e.target.value as "dark" | "light")}
                    >
                      <MenuItem value="dark">Escuro</MenuItem>
                      <MenuItem value="light">Claro</MenuItem>
                    </Select>
                  </Spacer>
                </Box>
              </Box>
            </Container>
          </Box>
        </Paper>
      </Box>
    </footer>
  );
}
