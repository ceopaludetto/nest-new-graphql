import * as React from "react";
import { useFormContext, get } from "react-hook-form";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Checkbox,
  CheckboxProps,
  Switch,
  Box,
} from "@material-ui/core";

type FormToggleProps = Omit<CheckboxProps, "name"> & {
  name: string;
  helperText?: React.ReactNode;
  label: string;
  info: string;
  variant?: "switch" | "checkbox";
};

export function FormToggle({ name, label, id, info, helperText, variant = "checkbox", ...rest }: FormToggleProps) {
  const { register, errors } = useFormContext();
  const error = get(errors, name);

  const Component = variant === "checkbox" ? Checkbox : Switch;

  return (
    <FormControl error={!!error} component="fieldset" fullWidth>
      <Box mb={0.5}>
        <FormLabel error={!!error} component="legend" id={`${id}-label`}>
          {label}
        </FormLabel>
      </Box>
      <FormControlLabel
        label={info}
        labelPlacement="end"
        control={<Component name={name} inputRef={register} color="primary" id={id} {...rest} />}
      />
      {(error?.message ?? helperText) && (
        <FormHelperText error={!!error}>{error?.message ?? helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
