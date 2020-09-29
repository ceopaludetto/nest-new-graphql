import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MdAdd } from "react-icons/md";

import { yupResolver } from "@hookform/resolvers";
import { Button, Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";

import { Page, Modal, FormControl, FormUpload } from "@/client/components";
import { useCreateBlockMutation, useShowBlocksQuery, ShowBlocksDocument, ShowBlocksQuery } from "@/client/graphql";
import { BlockSchema, BlockValues } from "@/client/helpers/validations/block.schema";

export default function Block() {
  const [newBlock, setNewBlock] = React.useState(false);
  const methods = useForm<BlockValues>({
    resolver: yupResolver(BlockSchema),
    defaultValues: {
      name: "",
      number: undefined,
      image: undefined,
    },
  });
  const [createBlock] = useCreateBlockMutation({
    update(cache, { data }) {
      const blocks = cache.readQuery<ShowBlocksQuery>({ query: ShowBlocksDocument });

      if (data?.createBlock && blocks?.showBlocks) {
        cache.writeQuery<ShowBlocksQuery>({
          query: ShowBlocksDocument,
          data: {
            __typename: "Query",
            showBlocks: [...blocks?.showBlocks, data.createBlock],
          },
        });
      }
    },
  });
  const { data } = useShowBlocksQuery();

  const handleSubmit = methods.handleSubmit(async ({ name, number, image }) => {
    try {
      const res = await createBlock({
        variables: {
          input: {
            name,
            number: Number(number),
            image: image?.[0],
          },
        },
      });

      if (res.data?.createBlock) {
        setNewBlock(false);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Page
      title="Blocos e Apartamentos"
      subtitle="Geral"
      actions={
        <Button onClick={() => setNewBlock(true)} color="primary" variant="contained" startIcon={<MdAdd />}>
          Novo Bloco
        </Button>
      }
      helmet={{ title: "Blocos e Apartamentos" }}
      maxWidth="xl"
    >
      <Modal
        title="Novo Bloco"
        open={newBlock}
        wrapper={(children) => (
          <FormProvider {...methods}>
            <form noValidate onSubmit={handleSubmit}>
              {children}
            </form>
          </FormProvider>
        )}
        actions={
          <>
            <Button color="primary" onClick={() => setNewBlock(false)}>
              Cancelar
            </Button>
            <Button disabled={methods.formState.isSubmitting} color="primary" type="submit">
              Adicionar
            </Button>
          </>
        }
        onClose={() => setNewBlock(false)}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl name="name" id="name" label="Nome" />
          </Grid>
          <Grid item xs={12}>
            <FormControl name="number" type="number" required id="number" label="Número" />
          </Grid>
          <Grid item xs={12}>
            <FormUpload multiple={false} id="image" accept="image/*" name="image" label="Imagem de Capa" />
          </Grid>
        </Grid>
      </Modal>
      <Grid container spacing={3}>
        {data?.showBlocks.map((block) => (
          <Grid item xs={12} md={6} lg={3} key={block.id}>
            <Card variant="outlined">
              <CardActionArea>
                {block.image && <CardMedia title="Luru" style={{ height: 200 }} />}
                <CardContent>
                  <Typography color="primary" variant="button">
                    Bloco
                  </Typography>
                  <Typography variant="h6">{block.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}
