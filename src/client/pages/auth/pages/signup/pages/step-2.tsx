import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography, Box, Grid } from "@material-ui/core";

import { FormControl, PasswordHelper, Spacer } from "@/client/components";
import { SignUpStep2Schema, SignUpStep2Values } from "@/client/helpers/validations/signup.schema";
import { useStepperContext, useMultipleVisibility, usePasswordHelp } from "@/client/hooks";
import { clean } from "@/client/utils/clean";

import { WizardContext } from "../providers";

export default function Step2() {
  const [getVisibilityProps] = useMultipleVisibility(["password", "repeatPassword"]);
  const { setValues, values } = React.useContext(WizardContext);
  const { next, prev } = useStepperContext();
  const methods = useForm<SignUpStep2Values>({
    resolver: yupResolver(SignUpStep2Schema),
    defaultValues: values,
  });
  const password = methods.watch("password");
  const passwordHelp = usePasswordHelp(password);

  const submit = methods.handleSubmit((data) => {
    if (values) {
      setValues({ ...values, ...clean(data) });
      next();
    }
  });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit}>
        <Grid container spacing={3}>
          <Grid container item xs={12} md={6} spacing={3}>
            <Grid item xs={12}>
              <FormControl
                autoFocus
                name="password"
                id="password"
                label="Senha"
                required
                autoComplete="off"
                aria-describedby="password-constraint-1 password-constraint-2 password-constraint-3"
                {...getVisibilityProps("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                name="repeatPassword"
                id="repeatPassword"
                label="Repetir Senha"
                required
                autoComplete="off"
                {...getVisibilityProps("repeatPassword")}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="label" color="textPrimary" htmlFor="password">
              Dicas de Senha
            </Typography>
            <Box mt={2}>
              <PasswordHelper id="password-constraint-1" active={passwordHelp.oneNumber}>
                Pelo menos 1 número.
              </PasswordHelper>
              <PasswordHelper id="password-constraint-2" active={passwordHelp.oneUpper}>
                Pelo menos 1 caractere maiúsculo.
              </PasswordHelper>
              <PasswordHelper id="password-constraint-3" active={passwordHelp.min}>
                No mínimo 6 caracteres.
              </PasswordHelper>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Spacer textAlign="right">
              <Button variant="text" color="primary" onClick={prev}>
                Voltar
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Próximo
              </Button>
            </Spacer>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
