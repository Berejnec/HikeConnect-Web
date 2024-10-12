import axios from "axios";
import { useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import ValidationErrors from "./ValidationErrors";

export default function TestErrors() {
  const baseUrl = import.meta.env.VITE_API_URL + "/";
  const [errors, setErrors] = useState(null);

  function handleNotFound() {
    axios.get(baseUrl + "buggy/not-found").catch((err) => console.log(err.response));
  }

  function handleBadRequest() {
    axios.get(baseUrl + "buggy/bad-request").catch((err) => console.log(err.response));
  }

  function handleServerError() {
    axios.get(baseUrl + "buggy/server-error").catch((err) => console.log(err.response));
  }

  function handleUnauthorised() {
    axios.get(baseUrl + "buggy/unauthorised").catch((err) => console.log(err.response));
  }

  function handleBadGuid() {
    axios.get(baseUrl + "activities/notaguid").catch((err) => console.log(err));
  }

  function handleValidationError() {
    axios.post(baseUrl + "activities", {}).catch((err) => setErrors(err));
  }

  return (
    <>
      <Header as="h1" content="Test Error component" />
      <Segment>
        <Button.Group widths="7">
          <Button onClick={handleNotFound} content="Not Found" secondary />
          <Button onClick={handleBadRequest} content="Bad Request" secondary />
          <Button onClick={handleValidationError} content="Validation Error" secondary />
          <Button onClick={handleServerError} content="Server Error" secondary />
          <Button onClick={handleUnauthorised} content="Unauthorised" secondary />
          <Button onClick={handleBadGuid} content="Bad Guid" secondary />
        </Button.Group>
      </Segment>
      {errors && <ValidationErrors errors={errors} />}
    </>
  );
}
