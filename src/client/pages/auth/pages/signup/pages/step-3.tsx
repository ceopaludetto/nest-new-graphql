import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, MenuItem, Grid, FormControlLabel, Radio } from "@material-ui/core";

import { MaskedFormControl, FormControl, FormSelect, FormToggle, FormRadioGroup, Spacer } from "@/client/components";
import {
  useShowStatesQuery,
  useRegisterMutation,
  ShowStatesDocument,
  ShowStatesQuery,
  LoggedDocument,
  LoggedQuery,
  SelectedCondominiumDocument,
  SelectedCondominiumQuery,
} from "@/client/graphql";
import * as Masks from "@/client/helpers/masks";
import { SignUpStep3Schema, SignUpStep3Values } from "@/client/helpers/validations/signup.schema";
import { useStepperContext, useErrorHandlerContext } from "@/client/hooks";
import { clean } from "@/client/utils/clean";
import type { Client } from "@/client/utils/common.dto";
import { splitPhone } from "@/client/utils/string";

import { WizardContext, initialValues } from "../providers";

export default function Step3() {
  const { setValues, values } = React.useContext(WizardContext);
  const { handleError } = useErrorHandlerContext();
  const { prev } = useStepperContext();
  const methods = useForm<SignUpStep3Values>({
    resolver: yupResolver(SignUpStep3Schema),
    defaultValues: values,
  });
  const type = methods.watch("type");
  const state = methods.watch("condominium.address.state");
  const [register, { client }] = useRegisterMutation();
  const { data } = useShowStatesQuery();

  const submit = methods.handleSubmit(
    handleError<SignUpStep3Values>(async (datas) => {
      if (values) {
        setValues({ ...values, ...clean(datas) });
        const {
          login,
          password,
          person: { phone, birthdate, ...person },
          condominium,
        } = values;

        if (condominium) {
          const {
            // state not needed
            address: { state: stateID, ...address },
          } = condominium;

          const res = await register({
            variables: {
              input: {
                login,
                password,
                person: {
                  ...person,
                  birthdate: birthdate as Date,
                  phones: phone ? [splitPhone(phone)] : [],
                  condominiums: [{ ...condominium, address }],
                },
              },
            },
          });

          if (res.data?.register.person.condominiums.length) {
            client.cache.writeQuery<SelectedCondominiumQuery>({
              query: SelectedCondominiumDocument,
              data: {
                __typename: "Query",
                selectedCondominium: res.data?.register.person.condominiums[0].id,
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

          if (res && res.data) {
            setValues(initialValues);
          }
        }
      }
    }, methods.setError)
  );

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormRadioGroup name="type" row>
              <FormControlLabel control={<Radio autoFocus />} name="type" value="enter" label="Ingressar condomínio" />
              <FormControlLabel control={<Radio />} name="type" value="create" label="Criar novo condomínio" />
            </FormRadioGroup>
          </Grid>
        </Grid>
        {type === "create" && (
          <Box mt={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl name="condominium.companyName" array id="companyName" label="Razão Social" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <MaskedFormControl rifm={Masks.cnpj} name="condominium.cnpj" id="cnpj" label="CNPJ" required />
              </Grid>
              <Grid item xs={12} md={3}>
                <MaskedFormControl rifm={Masks.cep} name="condominium.address.zip" id="zip" label="CEP" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl name="condominium.address.address" id="address" label="Endereço" required />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl name="condominium.address.number" id="number" label="Número" required />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormSelect name="condominium.address.state" id="state" label="Estado" required>
                  {data?.showStates.map((st) => (
                    <MenuItem key={st.id} value={st.id}>
                      {st.name}
                    </MenuItem>
                  ))}
                </FormSelect>
              </Grid>
              {!!state && (
                <Grid item xs={12} md={8}>
                  <FormSelect
                    defaultValue={data?.showStates[0].cities[0].id}
                    name="condominium.address.city"
                    id="city"
                    label="Cidade"
                    required
                  >
                    {data?.showStates
                      ?.find((st) => st.id === state)
                      ?.cities.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                  </FormSelect>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormToggle
              label="Termos de uso"
              info="Ao assinar essa opção você concorda com nossos termos de uso."
              id="terms"
              name="terms"
              color="secondary"
              variant="checkbox"
            />
          </Grid>
          <Grid item xs={12}>
            <Spacer textAlign="right">
              <Button variant="text" color="primary" onClick={prev}>
                Voltar
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Cadastrar
              </Button>
            </Spacer>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}

Step3.fetchBefore = async (client: Client) => {
  await client.query<ShowStatesQuery>({ query: ShowStatesDocument });
};
