import * as React from "react";
import { FiX } from "react-icons/fi";

import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Grow,
  Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { Tooltip } from "@/client/components/typography";

interface ModalProps extends DialogProps {
  title: string;
  wrapper?: (children: React.ReactNode) => JSX.Element;
  actions?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogActions: {
    padding: theme.spacing(2, 3, 3, 3),
  },
}));

export function Modal({ onClose, open, title, id, children, actions, wrapper, ...rest }: ModalProps) {
  const classes = useStyles();

  const markup = (
    <>
      <Box display="flex" alignItems="center">
        <Box flex={1}>
          <DialogTitle id={id}>{title}</DialogTitle>
        </Box>
        <Box px={3} py={1.75}>
          <Tooltip title="Fechar">
            <IconButton color="primary" onClick={onClose as any}>
              <FiX />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <DialogContent>
        <Box py={1}>{children}</Box>
      </DialogContent>
      {actions && <DialogActions className={classes.dialogActions}>{actions}</DialogActions>}
    </>
  );

  return (
    <Dialog TransitionComponent={Grow} onClose={onClose} aria-labelledby={id} open={open} {...rest}>
      {wrapper ? wrapper(markup) : markup}
    </Dialog>
  );
}
