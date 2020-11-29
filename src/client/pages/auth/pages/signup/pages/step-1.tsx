import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { MenuItem, Button, Grid } from "@material-ui/core";

import { FormControl, MaskedFormControl, FormCalendar, FormSelect, PreloadLink, Spacer } from "@/client/components";
import * as Masks from "@/client/helpers/masks";
import { SignUpStep1Schema, SignUpStep1Values } from "@/client/helpers/validations/signup.schema";
import { useStepperContext } from "@/client/hooks";
import { clean } from "@/client/utils/clean";
import { Gender } from "@/client/utils/common.dto";

import { WizardContext } from "../providers";

export default function Step1() {
  const { setValues, values } = React.useContext(WizardContext);
  const { next } = useStepperContext();
  const methods = useForm<SignUpStep1Values>({
    resolver: yupResolver(SignUpStep1Schema),
    defaultValues: values,
  });

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
          <Grid item xs={12} md={6}>
            <FormControl autoFocus name="person.name" id="name" label="Nome" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl name="person.lastName" id="lastName" label="Sobrenome" required />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl name="login" id="login" label="Login" required />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl type="person.email" name="person.email" id="email" label="E-mail" required />
          </Grid>
          <Grid item xs={12} md={3}>
            <MaskedFormControl rifm={Masks.cpf} name="person.cpf" id="cpf" label="CPF" required />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormSelect name="person.gender" id="gender" label="Gênero" required>
              <MenuItem value={Gender.M}>Masculino</MenuItem>
              <MenuItem value={Gender.F}>Feminino</MenuItem>
              <MenuItem value={Gender.N}>Outro</MenuItem>
            </FormSelect>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormCalendar disableFuture name="person.birthdate" id="birthdate" label="Data de Nascimento" required />
          </Grid>
          <Grid item xs={12} md={4}>
            <MaskedFormControl rifm={Masks.tel} name="person.phone" id="phone" type="tel" label="Telefone" />
          </Grid>
          <Grid item xs={12}>
            <Spacer textAlign="right">
              <Button component={PreloadLink} variant="text" color="primary" to="/auth/signin">
                Já possui conta?
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
