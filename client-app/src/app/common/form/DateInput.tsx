import { useField } from "formik";
import DatePicker, { DatePickerProps } from "react-datepicker";
import { Form, Label } from "semantic-ui-react";

export default function DateInput(props: DatePickerProps) {
  const [field, meta, { setValue }] = useField(props.name!);

  const handleChange = (val: Date | null | [Date | null, Date | null] | Date[]) => {
    if (Array.isArray(val)) {
      setValue(val);
    } else {
      setValue(val);
    }
  };

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={handleChange}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
