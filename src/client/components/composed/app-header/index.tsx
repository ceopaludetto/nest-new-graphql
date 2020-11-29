import * as React from "react";
import { FiChevronRight, FiLogOut, FiUser } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { RiSettings2Line } from "react-icons/ri";

import {
  IconButton,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Hidden,
  Collapse,
  Theme,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";

import { PreloadLink, Tooltip } from "@/client/components/typography";
import { useMeQuery, useEvictRefreshCookieMutation } from "@/client/graphql";
import { useBreadcrumbs } from "@/client/hooks";
import { tokenStore } from "@/client/providers/apollo";
import type { RouteComponentProps } from "@/client/utils/common.dto";
import { retrieveTo } from "@/client/utils/string";

import { Sidebar } from "../sidebar";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up("md")]: {
      borderColor: "transparent",
    },
  },
}));

export function AppHeader({ routes }: Pick<RouteComponentProps, "routes">) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
  const breadcrumbs = useBreadcrumbs();
  const { data, client } = useMeQuery();
  const [isOpen, setIsOpen] = React.useState(false);
  const [evict] = useEvictRefreshCookieMutation();
  const name = React.useMemo(() => data?.profile.person.name.substring(0, 2), [data]);
  const theme = useTheme<Theme>();
  const classes = useStyles();

  const handleLogout = React.useCallback(async () => {
    await evict();

    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "logged",
    });

    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "selectedCondominium",
    });

    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "profile",
    });

    tokenStore.clear();
  }, [client, evict]);

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Box py={{ xs: 0.5, md: 1 }}>
          <Box clone justifyContent={{ xs: "space-between", md: "center" }}>
            <Grid container alignItems="center">
              <Grid item md>
                <Hidden mdUp implementation="css">
                  <Tooltip title={!isOpen ? "Abrir Menu" : "Fechar Menu"}>
                    <IconButton onClick={() => setIsOpen((v) => !v)}>
                      <MdMenu />
                    </IconButton>
                  </Tooltip>
                </Hidden>
                <Hidden smDown implementation="css">
                  <Breadcrumbs separator={<FiChevronRight size={18} />}>
                    {breadcrumbs.map((b, i) =>
                      breadcrumbs.length - 1 === i ? (
                        <Typography key={b.name} color="textPrimary">
                          {b.meta?.displayName}
                        </Typography>
                      ) : (
                        <Link component={PreloadLink} key={b.name} color="inherit" to={retrieveTo(b.path)}>
                          {b.meta?.displayName}
                        </Link>
                      )
                    )}
                  </Breadcrumbs>
                </Hidden>
              </Grid>
              <Grid item xs="auto">
                <Hidden mdUp implementation="css">
                  <Box textAlign="center">
                    <svg
                      width="40"
                      viewBox="0 0 116 100"
                      fill={theme.palette.secondary.main}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" />
                    </svg>
                  </Box>
                </Hidden>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <Hidden smDown implementation="css">
                    <Tooltip title="Configurações">
                      <IconButton component={PreloadLink} to="/app/:condominium/settings">
                        <RiSettings2Line />
                      </IconButton>
                    </Tooltip>
                  </Hidden>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar>{name}</Avatar>
                  </IconButton>
                  <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(undefined)}>
                    <MenuItem>
                      <ListItemIcon>
                        <FiUser />
                      </ListItemIcon>
                      <ListItemText primary="Perfil" />
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <FiLogOut />
                      </ListItemIcon>
                      <ListItemText primary="Sair" />
                    </MenuItem>
                  </Menu>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Collapse in={isOpen}>
        <Sidebar routes={routes} onListItemClick={() => setIsOpen(false)} />
      </Collapse>
    </div>
  );
}
