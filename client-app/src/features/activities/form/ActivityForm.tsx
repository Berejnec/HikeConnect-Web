import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const { loadingInitial, createActivity, loadActivity, updateActivity } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id)
      loadActivity(id).then((activity) => {
        setActivity(new ActivityFormValues(activity));
      });
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => {
        navigate("/activities/" + newActivity.id);
      });
    } else {
      updateActivity(activity).then(() => {
        navigate("/activities/" + activity.id);
      });
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <TextInput name="title" placeholder="Title" />
            <TextArea rows={3} placeholder="Description" name="description" />
            <SelectInput options={categoryOptions} placeholder="Category" name="category" />
            <DateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat={"MMMM d, yyyy h:mm aa"}
            />

            <Header content="Location details" sub color="teal" />
            <TextInput placeholder="City" name="city" />
            <TextInput placeholder="Venue" name="venue" />

            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            ></Button>
            <Button as={Link} to={`/activities/${activity.id}`} floated="right" content="Cancel" type="button"></Button>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
