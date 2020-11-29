import * as React from "react";
import { Helmet } from "react-helmet-async";
import { FiUser, FiLock, FiBriefcase } from "react-icons/fi";
import { Switch, Route } from "react-router-dom";

import { Typography, Box } from "@material-ui/core";

import { Tooltip } from "@/client/components";
import {
  useStepper,
  StepperProvider,
  usePreload,
  useRedirect,
  useErrorHandler,
  ErrorHandlerProvider,
} from "@/client/hooks";
import type { RouteComponentProps } from "@/client/utils/common.dto";

import { WizardContext, WizardContextProps, initialValues } from "./providers";

const icons = [<FiUser size={16} />, <FiLock size={16} />, <FiBriefcase size={16} />];
const texts = ["Usuário", "Senha", "Condomínio"];

export default function SignUp({ routes, history, staticContext }: RouteComponentProps) {
  const handler = useErrorHandler();
  const [, run] = usePreload();
  const [currentPage, methods] = useStepper(3, async (index: number) => {
    await run(`/auth/signup/step-${index + 1}`);

    history.push(`/auth/signup/step-${index + 1}`);
  });
  const [values, setValues] = React.useState<WizardContextProps["values"]>(initialValues);

  useRedirect("/auth/signup/step-1", { status: 301, staticContext });

  return (
    <WizardContext.Provider value={{ values, setValues }}>
      <StepperProvider currentPage={currentPage} {...methods}>
        <ErrorHandlerProvider {...handler}>
          <Helmet>
            <title>Cadastro</title>
          </Helmet>
          <Box display="flex" alignItems="flex-start">
            <Box flex="1">
              <Typography component="span" color="primary" variant="h6">
                Cadastro
              </Typography>
              <Typography component="h1" gutterBottom variant="h4">
                Bem vindo
              </Typography>
            </Box>
            <Box>
              <Tooltip title={texts[currentPage]}>
                <Box borderRadius={9999} display="flex" p={1} color="text.secondary" border={1} borderColor="divider">
                  {icons[currentPage]}
                </Box>
              </Tooltip>
            </Box>
          </Box>
          <Box pt={3}>
            <Switch>
              {routes?.map(({ name, component: Component, children, ...rest }) => (
                <Route key={name} render={(props) => <Component routes={children} {...props} />} {...rest} />
              ))}
            </Switch>
          </Box>
        </ErrorHandlerProvider>
      </StepperProvider>
    </WizardContext.Provider>
  );
}
