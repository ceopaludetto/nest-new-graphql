import * as React from "react";
import { useFormContext, Controller, get } from "react-hook-form";

import { Select, InputLabel, FormControl, FormHelperText, SelectProps } from "@material-ui/core";

type FormSelectProps = Omit<SelectProps, "name" | "onChange" | "value"> & {
  name: string;
  helperText?: React.ReactNode;
};

export function FormSelect({ name, label, helperText, id, defaultValue = "", children, ...rest }: FormSelectProps) {
  const { control, errors } = useFormContext();
  const error = get(errors, name);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => (
        <FormControl fullWidth error={!!error}>
          {label && (
            <InputLabel id={`${id}-label`} error={!!error}>
              {label}
            </InputLabel>
          )}
          <Select
            id={id}
            labelId={`${id}-label`}
            label={label}
            error={!!error}
            value={value}
            onChange={onChange}
            {...rest}
          >
            {children}
          </Select>
          {(error?.message ?? helperText) && (
            <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
