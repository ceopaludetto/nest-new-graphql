import * as React from "react";
import { useFormContext, Controller, get } from "react-hook-form";

import { TextField, TextFieldProps } from "@material-ui/core";
import { Rifm } from "rifm";

interface MaskedFormControlProps extends Omit<TextFieldProps, "name" | "error"> {
  name: string;
  rifm: Omit<React.ComponentProps<typeof Rifm>, "value" | "onChange" | "children">;
}

export function MaskedFormControl({ name, helperText, rifm, defaultValue = "", ...rest }: MaskedFormControlProps) {
  const { errors } = useFormContext();
  const error = get(errors, name);

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ onBlur, ref, ...props }) => (
        <Rifm {...props} {...rifm}>
          {({ onChange, value }) => (
            <TextField
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              name={name}
              error={!!error}
              inputRef={ref}
              helperText={error?.message ?? helperText}
              {...rest}
            />
          )}
        </Rifm>
      )}
    />
  );
}
