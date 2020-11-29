import type { ApolloError } from "@apollo/client";

export function isGraphQLError(error: Error): error is ApolloError {
  return "graphQLErrors" in error;
}

type ErrorTypes =
  | {
      type: "generic";
      message: string;
      name: string;
    }
  | {
      type: "field";
      message: string;
      name: string;
      field: string;
    };

export function retrieveErrorType(error: Error): ErrorTypes {
  if (!isGraphQLError(error)) {
    return { type: "generic", message: error.message, name: error.name };
  }

  if (error.graphQLErrors[0] && error.graphQLErrors[0].extensions?.fields) {
    return {
      type: "field",
      message: error.message,
      name: error.name,
      field: error.graphQLErrors[0].extensions.fields[0],
    };
  }

  return { type: "generic", message: error.message, name: error.name };
}
