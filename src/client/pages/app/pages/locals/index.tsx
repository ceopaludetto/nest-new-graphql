import * as React from "react";
import { MdFilterList } from "react-icons/md";

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
            <Button variant="contained" color="primary">
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
      helmet={{ title: "Locais" }}
      maxWidth="xl"
    >
      teste
    </Page>
  );
}
