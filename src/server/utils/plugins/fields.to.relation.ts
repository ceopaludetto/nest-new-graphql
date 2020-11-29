import graphqFields from "graphql-fields";

interface GraphQLFieldsToRelationsOptions {
  depth?: number;
  root?: string;
  exclude?: string[];
}

export function GraphQLFieldsToRelations(
  info: Parameters<typeof graphqFields>[0],
  options: GraphQLFieldsToRelationsOptions = { depth: undefined, root: "", exclude: [] }
): string[] {
  const paths: string[][] = [];

  const nested = (field: any, key: string = undefined as any, deep = 0, parent: string[] = []) => {
    if (Object.values(field).length === 0) {
      return;
    }

    if (deep > 0 || !!options.root) {
      parent.push(key);
      if (
        parent.slice(!options.root ? 0 : options.root?.split(".").length).length > 0 &&
        parent.slice(0, !options.root ? 0 : options.root?.split(".").length).toString() ===
          (!options.root ? "" : options.root?.split(".").toString())
      ) {
        const path = parent.slice(!options.root ? 0 : options.root?.split(".").length);
        paths.push(path);
      }
    }

    Object.keys(field).forEach((k: any) => {
      if (Object.values(field[k]).length > 0 && !!options.depth ? deep < options.depth : true) {
        nested(field[k], k, deep + 1, [...parent]);
      }
    });
  };

  const value = !options.root
    ? graphqFields(info, {}, { excludedFields: options.exclude })
    : options.root.split(".").reduce((p, prop) => {
        return p[prop];
      }, graphqFields(info, {}, { excludedFields: options.exclude }));

  nested(value, options.root ? options.root.split(".").pop() : undefined);

  return paths.map((list: string[]) => list.join("."));
}
