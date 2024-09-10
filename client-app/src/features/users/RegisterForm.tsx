import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import TextInput from "../../app/common/form/TextInput";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import ValidationErrors from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{ displayName: "", userName: "", email: "", password: "", error: null }}
      onSubmit={(values, { setErrors, setSubmitting }) => {
        console.log(values);
        userStore.register(values).catch((error) => {
          setErrors({ error });
          setSubmitting(false);
        });
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        userName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
          <Header as="h2" color="teal" textAlign="center" content="Sign up to Reactivities"></Header>
          <TextInput placeholder={"Display Name"} name={"displayName"} />
          <TextInput placeholder={"Username"} name={"userName"} />
          <TextInput placeholder={"Email"} name={"email"} type="email" />
          <TextInput placeholder={"Password"} name={"password"} type="password" />
          <ErrorMessage name="error" render={() => <ValidationErrors errors={errors.error} />} />
          <Button
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
            positive
            content="Register"
            type="submit"
            fluid
          ></Button>
        </Form>
      )}
    </Formik>
  );
});
