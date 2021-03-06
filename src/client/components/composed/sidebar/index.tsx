import { useState, useCallback, useMemo, Fragment } from "react";
import { FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiOutlineSwitchVertical } from "react-icons/hi";

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
  fade,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { Logo } from "@/client/assets/logo";
import { PreloadNavLink, Tooltip, PreloadLink } from "@/client/components/typography";
import { useMeQuery } from "@/client/graphql/index.graphql";
import { useCurrentCondominium, useChangeCondominium } from "@/client/hooks";
import { sidebar } from "@/client/providers/sidebar";
import { isMultiCondominium } from "@/client/utils/condominium";
import { findRouteByName } from "@/client/utils/preload";
import { retrieveTo } from "@/client/utils/string";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    borderLeft: 0,
    borderBottom: 0,
    left: 0,
    top: 0,
    width: "100%",
    borderTop: 0,
  },
  sidebar: {
    flexDirection: "column",
    display: "flex",
    height: "100vh",
    backgroundColor: theme.palette.background.paper,
  },
  sidebarList: {
    padding: theme.spacing(1.5),
  },
  sidebarItem: {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.25, 2),
    "& + $sidebarItem": {
      marginTop: theme.spacing(1),
    },
    "&$active": {
      backgroundColor: fade(theme.palette.primary.main, 0.2),
      color: theme.palette.primary.main,
      "& svg": {
        color: theme.palette.primary.main,
      },
    },
  },
  sidebarItemText: {
    margin: 0,
    "& span": {
      fontWeight: theme.typography.fontWeightMedium,
      lineHeight: 1,
    },
  },
  sidebarListCollapse: {
    marginBottom: theme.spacing(1),
  },
  sidebarItemIcon: {
    color: theme.palette.text.primary,
  },
  sidebarSubList: {
    padding: theme.spacing(1, 0, 0),
    "& $sidebarItem": {
      paddingLeft: theme.spacing(3.5),
    },
  },
  active: {},
  condominiums: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  list: {
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create(["max-height"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short,
    }),
  },
  weight: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: `rgba(0, 0, 0, ${theme.palette.action.hoverOpacity})`,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer - 1,
    border: "none",
    "&:focus": {
      outline: "none",
    },
  },
}));

interface SidebarProps {
  onSelect?: () => void;
}

export function Sidebar({ onSelect }: SidebarProps) {
  const [listOpen, setListOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});
  const { data } = useMeQuery();

  const multiCondominiums = useMemo(() => isMultiCondominium(data?.profile?.person?.condominiums), [data]);
  const condominium = useCurrentCondominium();
  const changeCondominium = useChangeCondominium();
  const classes = useStyles();

  const handleCondominiumChange = useCallback(
    async (id: string) => {
      await changeCondominium(id);

      setListOpen((v) => !v);
    },
    [setListOpen, changeCondominium]
  );

  const renderItems = useCallback(
    (sidebarItems: typeof sidebar = sidebar) =>
      sidebarItems.map((item) => {
        if (item.type === "route") {
          const route = findRouteByName(item.routeName);

          const Icon = route?.meta?.icon;

          const path = retrieveTo(route?.path);

          return route ? (
            <ListItem
              key={item.routeName}
              button
              component={PreloadNavLink}
              activeClassName={classes.active}
              classes={{ root: classes.sidebarItem }}
              onClick={onSelect}
              exact
              to={path}
            >
              <ListItemIcon classes={{ root: classes.sidebarItemIcon }}>
                <Icon size={21} />
              </ListItemIcon>
              <ListItemText primary={route.meta?.displayName} classes={{ root: classes.sidebarItemText }} />
            </ListItem>
          ) : undefined;
        }

        const Icon = item.icon;

        return (
          <Fragment key={item.key}>
            <ListItem
              button
              onClick={() => setSubmenuOpen((current) => ({ ...current, [item.key]: !current[item.key] }))}
              classes={{ root: classes.sidebarItem }}
            >
              <ListItemIcon classes={{ root: classes.sidebarItemIcon }}>
                <Icon size={21} />
              </ListItemIcon>
              <ListItemText primary={item.title} classes={{ root: classes.sidebarItemText }} />
              {submenuOpen[item.key] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </ListItem>
            <Collapse className={classes.sidebarListCollapse} in={submenuOpen[item.key]}>
              <List classes={{ root: clsx(classes.sidebarList, classes.sidebarSubList) }} component="nav">
                {renderItems(item.children)}
              </List>
            </Collapse>
          </Fragment>
        );
      }),
    [classes, submenuOpen, onSelect]
  );

  return (
    <Paper className={classes.container} square variant="outlined">
      <div className={classes.sidebar}>
        <Box flex="1">
          <Box width="100%" display="flex" py={3} justifyContent="center">
            <PreloadLink to="/app">
              <Logo isLogoType height={40} />
            </PreloadLink>
          </Box>
          <List classes={{ root: classes.sidebarList }} component="nav">
            {renderItems()}
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
                    {listOpen ? <FiX /> : <HiOutlineSwitchVertical />}
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
                  <ListItem button onClick={() => handleCondominiumChange(c.id)} key={c.id}>
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
      </div>
    </Paper>
  );
}
