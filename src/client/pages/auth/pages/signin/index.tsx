import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Typography, Link, Grid } from "@material-ui/core";

import { FormControl, PreloadLink } from "@/client/components";
import {
  useLoginMutation,
  LoggedDocument,
  LoggedQuery,
  SelectedCondominiumDocument,
  SelectedCondominiumQuery,
} from "@/client/graphql";
import { SignInSchema, SignInValues } from "@/client/helpers/validations/signin.schema";
import { useVisibility, useErrorHandler } from "@/client/hooks";

export default function SignIn() {
  const { defaultError, handleError } = useErrorHandler();
  const [login, { client }] = useLoginMutation();
  const methods = useForm<SignInValues>({ resolver: yupResolver(SignInSchema) });
  const [getFieldProps] = useVisibility();

  const submit = methods.handleSubmit(
    handleError<SignInValues>(async (data) => {
      const res = await login({
        variables: {
          input: data,
        },
      });

      if (res.data?.login.person.condominiums.length) {
        client.cache.writeQuery<SelectedCondominiumQuery>({
          query: SelectedCondominiumDocument,
          data: {
            __typename: "Query",
            selectedCondominium: res.data?.login.person.condominiums[0].id,
          },
        });
      }

      client.cache.writeQuery<LoggedQuery>({
        query: LoggedDocument,
        data: {
          __typename: "Query",
          logged: true,
        },
      });
    }, methods.setError)
  );

  return (
    <FormProvider {...methods}>
      <form noValidate autoComplete="on" onSubmit={submit}>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Typography component="span" color="primary" variant="h6">
          Login
        </Typography>
        <Typography gutterBottom component="h1" variant="h4">
          Bem vindo de volta
        </Typography>
        {defaultError && (
          <Typography variant="body2" color="error">
            Falha ao realizar login
          </Typography>
        )}
        <Box pt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl autoComplete="on" autoFocus label="Login" name="login" id="login" />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                autoComplete="password"
                label="Senha"
                name="password"
                id="password"
                helperText={
                  <Link component={PreloadLink} color="primary" to="/auth/forgot">
                    Esqueceu a senha?
                  </Link>
                }
                {...getFieldProps()}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={methods.formState.isSubmitting}
                size="large"
                color="primary"
                fullWidth
                variant="contained"
                type="submit"
              >
                Entrar
              </Button>
              <Box mt={2}>
                <Button
                  component={PreloadLink}
                  variant="text"
                  fullWidth
                  size="large"
                  color="primary"
                  to="/auth/signup/step-1"
                >
                  Cadastre-se
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
}
