import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useForm, FormProvider } from "react-hook-form";
import { FiX } from "react-icons/fi";

import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Button, Divider, Box, Typography, Snackbar, IconButton } from "@material-ui/core";

import { FormControl, FormToggle, FormCalendar, MaskedFormControl, PasswordHelper } from "@/client/components";
import { useMeQuery, MeQuery, useUpdateUserMutation, useChangePasswordMutation, MeDocument } from "@/client/graphql";
import * as Masks from "@/client/helpers/masks";
import {
  SettingsPasswordSchema,
  SettingsPasswordValues,
  SettingsPersonalSchema,
  SettingsPersonalValues,
} from "@/client/helpers/validations/settings.schema";
import { useMultipleVisibility, usePasswordHelp, useErrorHandler } from "@/client/hooks";
import type { Client } from "@/client/utils/common.dto";
import { splitPhone, mergePhone } from "@/client/utils/string";

export default function Personal() {
  const { handleError: handlePersonalError, defaultError: personalError } = useErrorHandler();
  const { handleError: handlePasswordError, defaultError: passwordError } = useErrorHandler();
  const [snackbar, setSnackbar] = React.useState({
    content: "",
    isOpen: false,
  });
  const [mapPropsToField] = useMultipleVisibility(["currentPassword", "newPassword", "repeatNewPassword"]);
  const [changePassword] = useChangePasswordMutation();
  const [changeUserData] = useUpdateUserMutation();
  const { data } = useMeQuery();

  const personal = useForm<SettingsPersonalValues>({
    resolver: yupResolver(SettingsPersonalSchema),
    defaultValues: {
      name: data?.profile.person.name,
      lastName: data?.profile.person.lastName,
      cpf: data?.profile.person.cpf,
      login: data?.profile.login,
      email: data?.profile.person.email,
      phone: Masks.tel.format(mergePhone(data?.profile.person.phones[0])),
      birthdate: data?.profile.person.birthdate,
      publicAccount: false,
    },
  });

  const password = useForm<SettingsPasswordValues>({
    resolver: yupResolver(SettingsPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  const newPasswordValue = password.watch("newPassword");
  const passwordHelp = usePasswordHelp(newPasswordValue);

  const handlePersonalSubmit = personal.handleSubmit(
    handlePersonalError<SettingsPersonalValues>(async ({ login, birthdate, phone, publicAccount, ...rest }) => {
      await changeUserData({
        variables: {
          input: {
            login,
            person: {
              birthdate: birthdate as Date,
              phones: phone ? [splitPhone(phone)] : undefined,
              ...rest,
            },
          },
        },
      });

      setSnackbar({ content: "Informações pessoais alteradas com sucesso!", isOpen: true });

      personal.reset(personal.getValues());
    }, personal.setError)
  );

  const handlePasswordSubmit = password.handleSubmit(
    handlePasswordError<SettingsPasswordValues>(async ({ currentPassword, newPassword }) => {
      await changePassword({
        variables: {
          input: {
            currentPassword,
            newPassword,
          },
        },
      });

      setSnackbar({ content: "Senha alterada com sucesso!", isOpen: true });

      password.reset();
    }, password.setError)
  );

  const handleClose = React.useCallback(() => {
    setSnackbar((current) => ({ ...current, isOpen: false }));
  }, []);

  return (
    <>
      <Snackbar
        message={snackbar.content}
        open={snackbar.isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={5000}
        action={
          <IconButton size="small" onClick={handleClose} color="inherit">
            <FiX />
          </IconButton>
        }
      />
      <Helmet title="Configurações - Informações Pessoais" />
      <FormProvider {...personal}>
        <form noValidate onSubmit={handlePersonalSubmit}>
          {personalError && (
            <Typography variant="body2" color="error">
              Falha ao alterar dados de usuário
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl autoFocus name="name" label="Nome" id="name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl name="lastName" label="Sobrenome" id="lastName" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl name="login" label="Login" id="login" />
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl name="email" label="E-mail" id="email" />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaskedFormControl rifm={Masks.cpf} name="cpf" label="CPF" id="cpf" />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaskedFormControl rifm={Masks.tel} name="phone" label="Telefone" id="phone" />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormCalendar disableFuture name="birthdate" label="Data de Nascimento" id="birthdate" />
            </Grid>
            <Grid item xs={12}>
              <FormToggle
                color="primary"
                label="Conta pública"
                info="Ser visível a todos usuários do condomínio atual."
                id="publicAccount"
                name="publicAccount"
                variant="switch"
              />
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="right">
                <Button
                  disabled={personal.formState.isSubmitting || !personal.formState.isDirty}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Alterar Informações
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      <Box my={3}>
        <Divider />
      </Box>
      <FormProvider {...password}>
        <form noValidate onSubmit={handlePasswordSubmit}>
          {passwordError && (
            <Typography variant="body2" color="error">
              Falha ao alterar senha
            </Typography>
          )}
          <Grid container spacing={3}>
            <Box clone order={{ xs: 13, md: -1 }}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl
                      autoComplete="password"
                      name="currentPassword"
                      label="Senha Atual"
                      id="currentPassword"
                      {...mapPropsToField("currentPassword")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      autoComplete="off"
                      name="newPassword"
                      label="Nova Senha"
                      id="newPassword"
                      {...mapPropsToField("newPassword")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      autoComplete="off"
                      name="repeatNewPassword"
                      label="Repetir Nova Senha"
                      id="repeatNewPassword"
                      {...mapPropsToField("repeatNewPassword")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="right">
                      <Button
                        color="primary"
                        variant="contained"
                        disabled={password.formState.isSubmitting || !password.formState.isDirty}
                        type="submit"
                      >
                        Alterar Senha
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12} md={6}>
              <Typography component="label" color="textPrimary" htmlFor="newPassword">
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
          </Grid>
        </form>
      </FormProvider>
      <Box my={3}>
        <Divider />
      </Box>
      <Box textAlign="center" color="error.main" pb={3}>
        <Button variant="text" color="inherit">
          Excluir Conta
        </Button>
      </Box>
    </>
  );
}

Personal.fetchBefore = async (client: Client) => {
  await client.query<MeQuery>({ query: MeDocument });
};
