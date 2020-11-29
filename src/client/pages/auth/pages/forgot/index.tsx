import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FormProvider } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useInterval } from "react-use";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography, Box, Grid } from "@material-ui/core";

import { FormControl, PreloadLink } from "@/client/components";
import { useAuthForgotMutation } from "@/client/graphql";
import { ForgotSchema, ForgotValues } from "@/client/helpers/validations/forgot.schema";
import { usePreload, useErrorHandler } from "@/client/hooks";

export default function Forgot() {
  const { handleError } = useErrorHandler();
  const [forgot, { data }] = useAuthForgotMutation();
  const methods = useForm<ForgotValues>({ resolver: yupResolver(ForgotSchema) });
  const [submitted, setSubmitted] = React.useState(false);
  const [time, setTime] = React.useState(5);
  const [, run] = usePreload();
  const history = useHistory();

  useInterval(
    async () => {
      if (submitted) {
        if (time > 1) {
          setTime((curr) => curr - 1);
        } else {
          await run("/auth/signin");
          history.push("/auth/signin");
        }
      }
    },
    submitted ? 1000 : undefined
  );

  const submit = methods.handleSubmit(
    handleError<ForgotValues>(async (values) => {
      const callback = `${window.location.origin}/auth/recover`;

      await forgot({
        variables: {
          input: { ...values, callback },
        },
      });

      setSubmitted(true);
    }, methods.setError)
  );

  return (
    <FormProvider {...methods}>
      <form noValidate autoComplete="on" onSubmit={submit}>
        <Helmet>
          <title>Esqueceu a senha</title>
        </Helmet>
        <Typography component="span" color="primary" variant="h6">
          Esqueceu a senha
        </Typography>
        <Typography component="h1" gutterBottom variant="h4">
          Recuperar Senha
        </Typography>
        <Box pt={2}>
          {submitted ? (
            <>
              <Typography gutterBottom>
                Um e-mail com instruções de recuperação de senha foi enviado para {data?.forgot}!
              </Typography>
              <Typography variant="caption">
                Você será redirecionado em {time} segundo{time !== 1 && "s"}.
              </Typography>
              <Box textAlign="right" mt={3}>
                <Button component={PreloadLink} variant="text" color="primary" to="/auth/signin">
                  Ir agora
                </Button>
              </Box>
            </>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl label="Login" name="login" id="login" autoFocus />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={methods.formState.isSubmitting}
                  fullWidth
                  color="primary"
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  Recuperar Senha
                </Button>
                <Box mt={2}>
                  <Button
                    component={PreloadLink}
                    variant="text"
                    fullWidth
                    size="large"
                    color="primary"
                    to="/auth/signin"
                  >
                    Voltar para Login
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </form>
    </FormProvider>
  );
}
