/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import type { UseFormMethods, SubmitHandler, UnpackNestedValue } from "react-hook-form";

import { retrieveErrorType } from "@/client/utils/error";

export function useErrorHandler() {
  const [defaultError, setDefaultError] = React.useState("");

  const handleError = React.useCallback(
    <T extends Record<string, any>>(handler: SubmitHandler<T>, setError: UseFormMethods["setError"]) => async (
      data: UnpackNestedValue<T>
    ) => {
      setDefaultError("");
      try {
        await handler(data);
      } catch (err) {
        const error = retrieveErrorType(err);
        if (error.type === "field") {
          setError(error.field, { message: error.message });
        } else {
          setDefaultError(error.message);
        }
      }
    },
    []
  );

  const emptyDefaultError = React.useCallback(() => setDefaultError(""), [setDefaultError]);

  return { defaultError, handleError, emptyDefaultError };
}

const ErrorHandlerContext = React.createContext<ReturnType<typeof useErrorHandler>>({
  defaultError: "",
  handleError: (handler) => async () => {},
  emptyDefaultError: () => {},
});

type ErrorHandlerProviderProps = {
  children: React.ReactNode;
} & ReturnType<typeof useErrorHandler>;

export function ErrorHandlerProvider({ children, ...rest }: ErrorHandlerProviderProps) {
  return <ErrorHandlerContext.Provider value={rest}>{children}</ErrorHandlerContext.Provider>;
}

export function useErrorHandlerContext() {
  return React.useContext(ErrorHandlerContext);
}
