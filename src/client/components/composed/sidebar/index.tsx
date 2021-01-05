import * as React from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Box,
  Theme,
  IconButton,
  Typography,
  Collapse,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Logo } from "@/client/assets/logo";
import { Blurred } from "@/client/components/layout";
import { PreloadNavLink, Tooltip, PreloadLink } from "@/client/components/typography";
import { useMeQuery, SelectedCondominiumQuery, SelectedCondominiumDocument } from "@/client/graphql";
import { usePathWithCondominium } from "@/client/hooks";
import type { RouteComponentProps } from "@/client/utils/common.dto";
import { isMultiCondominium } from "@/client/utils/condominium";
import { retrieveTo } from "@/client/utils/string";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    borderLeft: 0,
    borderBottom: 0,
    [theme.breakpoints.up("md")]: {
      position: "fixed",
      left: 0,
      top: 0,
      maxWidth: "300px",
      borderTop: 0,
    },
    [theme.breakpoints.down("sm")]: {
      borderRight: 0,
    },
  },
  sidebar: {
    flexDirection: "column",
    display: "flex",
    [theme.breakpoints.up("md")]: {
      height: "100vh",
    },
  },
  active: {
    color: theme.palette.primary.main,
    "& svg": {
      color: theme.palette.primary.main,
    },
  },
  condominiums: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  list: {
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["max-height"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short,
    }),
  },
  weight: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export function Sidebar({
  routes,
  onListItemClick,
}: Pick<RouteComponentProps, "routes"> & { onListItemClick?: () => void }) {
  const [listOpen, setListOpen] = React.useState(false);
  const { data, client } = useMeQuery();
  const history = useHistory();
  const multiCondominiums = React.useMemo(() => isMultiCondominium(data?.profile?.person?.condominiums), [data]);
  const [generatePath, condominium] = usePathWithCondominium();
  const classes = useStyles();

  const changeSelectedCondominium = React.useCallback(
    (id: string) => {
      client.cache.writeQuery<SelectedCondominiumQuery>({
        query: SelectedCondominiumDocument,
        data: {
          __typename: "Query",
          selectedCondominium: id,
        },
      });

      const path = generatePath("/app/:condominium", {
        condominium: id,
      });

      history.replace(path);
    },
    [client, generatePath, history]
  );

  const handleCondominiumChange = React.useCallback(
    (id: string) => {
      if (condominium?.id !== id) {
        changeSelectedCondominium(id);
      }
      setListOpen((v) => !v);
    },
    [condominium, setListOpen, changeSelectedCondominium]
  );

  return (
    <Paper className={classes.container} square variant="outlined">
      <Blurred className={classes.sidebar}>
        <Box flex="1">
          <Box width="100%" display="flex" py={3} justifyContent="center">
            <PreloadLink to="/app/:condominium">
              <Logo isLogoType height={40} />
            </PreloadLink>
          </Box>
          <List component="nav">
            {routes?.map((r) => {
              const Icon = r.meta?.icon;
              const path = retrieveTo(r.path);

              return r.meta?.hidden ? (
                <Hidden key={r.name} implementation="css" mdUp>
                  <ListItem
                    button
                    onClick={onListItemClick}
                    component={PreloadNavLink}
                    activeClassName={classes.active}
                    exact
                    to={path}
                  >
                    <ListItemIcon>
                      <Icon size={21} />
                    </ListItemIcon>
                    <ListItemText primary={r.meta?.displayName} />
                  </ListItem>
                </Hidden>
              ) : (
                <ListItem
                  key={r.name}
                  button
                  onClick={onListItemClick}
                  component={PreloadNavLink}
                  activeClassName={classes.active}
                  exact
                  to={path}
                >
                  <ListItemIcon>
                    <Icon size={21} />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: "subtitle1", classes: { root: classes.weight } }}
                    primary={r.meta?.displayName}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box display="flex" alignItems="center" px={2} py={2} className={classes.condominiums}>
          {multiCondominiums ? (
            <>
              <Box flex="1">
                <Typography component="span" display="block" variant="overline" color="primary">
                  Condomínio
                </Typography>
                <Typography component="span" variant="body1">
                  {listOpen ? "Selecione um condomínio" : condominium?.companyName}
                </Typography>
              </Box>
              <Box>
                <Tooltip title={listOpen ? "Fechar" : "Alterar condomínio"}>
                  <IconButton color="primary" onClick={() => setListOpen((v) => !v)}>
                    {listOpen ? <FiX /> : <AiOutlineSwap />}
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box>
              <Typography component="span" display="block" variant="overline" color="primary">
                Condomínio
              </Typography>
              <Typography component="span" variant="body1">
                {condominium?.companyName}
              </Typography>
            </Box>
          )}
        </Box>
        {multiCondominiums && (
          <Collapse in={listOpen}>
            <div className={classes.list}>
              <List>
                {data?.profile.person.condominiums.map((c) => (
                  <ListItem
                    button
                    onClick={() => {
                      handleCondominiumChange(c.id);
                      if (onListItemClick) onListItemClick();
                    }}
                    key={c.id}
                  >
                    <ListItemText
                      primaryTypographyProps={{ color: condominium?.id === c.id ? "primary" : "textPrimary" }}
                      primary={c.companyName}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          </Collapse>
        )}
      </Blurred>
    </Paper>
  );
}
