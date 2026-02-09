import React from "react";

export const useForm = ({ config,initialValues={} }: { config: any,initialValues?:any }) => {
  const [_config, setConfig] = React.useState(
    config.reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {})
  );

  const [formValues, setFormValues] = React.useState<any>(
    config.reduce((acc, field) => {
      acc[field.name] = initialValues?.[field.name] || field.defaultValue || "";
      return acc;
    }, {})
  );

  const [errors, setErrors] = React.useState<any>(
    config.reduce((acc, field) => {
      acc[field.name] = { value: false, message: "" };
      return acc;
    }, {})
  );

  const checkRule = (val: any, rule: any) => {
    if (
      (rule?.max && val.length > rule?.max) ||
      (rule?.min && val.length < rule?.min)
    ) {
      return false;
    }
    if (rule?.pattern && !rule?.pattern.test(val)) {
      return false;
    }
    if (rule?.validate && !rule?.validate(val)) {
      return false;
    }
    return true;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Reset error state on change
    setErrors((prev) => ({ ...prev, [name]: { value: false, message: "" } }));
    const opt = _config[name];
    if (opt.rules) {
      opt.rules.forEach((rule: any) => {
        if (checkRule(value, rule)) {
          return;
        }
        setErrors((prev) => ({
          ...prev,
          [name]: { value: true, message: rule.message },
        }));
      });
    }
  };

  const validate = ({ exclude }: { exclude: string[] } = { exclude: [] }) => {
    const newErrors = config.reduce((acc, field) => {
      acc[field.name] = { value: false, message: "" };
      return acc;
    }, {});
    let hasError = false;
    Object.keys(formValues).forEach((key) => {
      if (exclude.includes(key)) {
        return;
      }

      const val = formValues[key];
      // if (newErrors[key]) {
      //   newErrors[key] = { value: true, message: "This field is required" };
      // }
      const opt = _config[key];
      const rules = opt?.rules ?? [];
      if (opt.required) {
        if (val === "" || val === null || val === undefined) {
          newErrors[key] = { value: true, message: opt.label + " is required" };
          hasError = true;
          return false;
        }
      }
      if (rules) {
        rules.forEach((rule: any) => {
          if (checkRule(val, rule)) {
            return;
          }
          newErrors[key] = { value: true, message: rule.message };
          hasError = true;
        });
      }
    });

    setErrors(newErrors);
    return !hasError;
  };
  return {
    formValues,
    errors,
    handleChange,
    setErrors,
    setFormValues,
    validate,
  };
};
