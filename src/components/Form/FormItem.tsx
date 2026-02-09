import { classNames } from "@/utils/classNames";
import { FormLabel } from "../FormLabel";
import { FormHelperText, FormControl } from "@mui/material";

export const FormItem = (props) => {
  const {
    name,
    label,
    required = false,
    errors,
    formValues,
    handleChange,
    placeholder = "",
    component,
    labelExtra,
    className,
    tooltip,
    icon,
    componentProps,
    labelClassName,
  } = props;
  return (
    <FormControl
      fullWidth
      margin="normal"
      error={errors[name]?.value}
      className={classNames("", className)}
      sx={{ "&": { marginTop: "24px" } }}
    >
      <FormLabel icon={icon} required={required} extra={labelExtra} tooltip={tooltip} className={labelClassName}>
        {label}
      </FormLabel>
      {component({
        name: name,
        value: formValues[name],
        onChange: handleChange,
        placeholder: placeholder,
        ...componentProps
      })}
      {errors[name]?.value && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  );
};
