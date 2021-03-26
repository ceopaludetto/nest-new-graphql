import { useRef } from "react";
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
  Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Logo } from "@/client/assets/logo";
import { Spacer } from "@/client/components/layout";
import { PreloadLink, Tooltip } from "@/client/components/typography";
import { useColorMode } from "@/client/hooks";
import { routes } from "@/client/providers/routes";
import { retrieveTo } from "@/client/utils/string";
import type { Route } from "@/client/utils/types";

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
}));

export function Footer() {
  const { current } = useRef(routes.find((r: Route) => r.name === "@MAIN"));
  const { current: company } = useRef(current?.children?.filter((r: Route) => r.meta?.type === "company"));
  const { current: resource } = useRef(current?.children?.filter((r: Route) => r.meta?.type === "resource"));
  const { current: legal } = useRef(current?.children?.filter((r: Route) => r.meta?.type === "legal"));
  const { colorMode, changeColorMode } = useColorMode();

  const classes = useStyles();

  return (
    <footer>
      <Box clone borderColor="divider" borderTop="1px solid">
        <Paper variant="elevation" elevation={0} square>
          <Box py={4}>
            <Container maxWidth="md">
              <Grid container>
                <Grid className={classes.item} item xs={12} md>
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
                <Grid className={classes.item} item xs={12} md>
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
                <Grid className={classes.item} item xs={12} md>
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
                  <PreloadLink to="/" aria-label="Início">
                    <Logo isLogoType height={40} />
                  </PreloadLink>
                  <Box mt={2}>
                    <Typography variant="body2">Copyright © 2020 Domus Inc. Todos direitos reservados.</Typography>
                  </Box>
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
                    <Box minWidth={150}>
                      <Select
                        margin="dense"
                        value={colorMode}
                        startAdornment={
                          <InputAdornment position="start">
                            {colorMode === "dark" ? <FiMoon /> : <FiSun />}
                          </InputAdornment>
                        }
                        fullWidth
                        onChange={(e) => changeColorMode(e.target.value as "dark" | "light")}
                      >
                        <MenuItem value="dark">Escuro</MenuItem>
                        <MenuItem value="light">Claro</MenuItem>
                      </Select>
                    </Box>
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
