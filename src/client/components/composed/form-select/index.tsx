import * as React from "react";
import { useFormContext, Controller, get } from "react-hook-form";

import { TextField, TextFieldProps } from "@material-ui/core";

type FormSelectProps = Omit<TextFieldProps, "name" | "onChange" | "value" | "inputRef"> & {
  name: string;
  helperText?: React.ReactNode;
};

export function FormSelect({ name, helperText, defaultValue = "", children, ...rest }: FormSelectProps) {
  const { errors } = useFormContext();
  const error = get(errors, name);

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ ref, ...props }) => (
        <TextField select inputRef={ref} helperText={error?.message ?? helperText} error={!!error} {...props} {...rest}>
          {children}
        </TextField>
      )}
    />
  );
}
