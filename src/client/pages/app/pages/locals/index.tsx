import * as React from "react";
import { MdFilterList, MdAdd } from "react-icons/md";

import { Button, IconButton, Box } from "@material-ui/core";

import { Page, Tooltip } from "@/client/components";

export default function Locals() {
  return (
    <Page
      title="Locais"
      subtitle="Geral"
      actions={
        <Box display="flex" alignItems="center">
          <Box pr={2}>
            <Button variant="contained" color="primary" startIcon={<MdAdd />}>
              Novo Local
            </Button>
          </Box>
          <Box>
            <Tooltip title="Filtro">
              <IconButton color="default">
                <MdFilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      }
      helmetProps={{ title: "Locais" }}
      maxWidth="xl"
    >
      teste
    </Page>
  );
}
