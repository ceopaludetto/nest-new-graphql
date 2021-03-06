import type { ComponentProps } from "react";
import { useFormContext, Controller, get } from "react-hook-form";

import { TextField, TextFieldProps } from "@material-ui/core";
import { Rifm } from "rifm";

interface MaskedFormControlProps extends Omit<TextFieldProps, "name" | "error"> {
  name: string;
  rifm: Omit<ComponentProps<typeof Rifm>, "value" | "onChange" | "children">;
}

export function MaskedFormControl({
  name,
  helperText,
  rifm,
  defaultValue = "",
  variant = "outlined",
  ...rest
}: MaskedFormControlProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onBlur, ref, ...props } }) => (
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
              variant={variant}
              {...rest}
            />
          )}
        </Rifm>
      )}
    />
  );
}
