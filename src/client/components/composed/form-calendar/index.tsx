import * as React from "react";
import { Controller, useFormContext, get } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";

import { KeyboardDatePicker, KeyboardDatePickerProps } from "@material-ui/pickers";

type FormCalendarProps = Omit<KeyboardDatePickerProps, "name" | "value" | "onChange" | "onBlur"> & { name: string };

export function FormCalendar({ name, helperText, defaultValue = new Date(), ...rest }: FormCalendarProps) {
  const { errors } = useFormContext();
  const error = get(errors, name);

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ ref, ...props }) => {
        return (
          <KeyboardDatePicker
            error={!!error}
            format="DD/MM/YYYY"
            helperText={error?.message ?? helperText}
            keyboardIcon={<FiCalendar />}
            KeyboardButtonProps={{ color: "primary" }}
            okLabel="Selecionar"
            cancelLabel="Cancelar"
            inputRef={ref}
            {...props}
            {...rest}
          />
        );
      }}
    />
  );
}
