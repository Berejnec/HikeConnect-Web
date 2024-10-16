import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Header, Image, Tab, TabPane, TabProps } from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];
export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const { loadActivities, profile, loadingActivities, userActivities } = profileStore;

  useEffect(() => {
    if (profile?.username) {
      loadActivities(profile.username);
    }
  }, [profile, loadActivities]);

  const handleTabChange = (_: SyntheticEvent, data: TabProps) => {
    loadActivities(profile!.username, panes[data.activeIndex as number].pane.key);
  };

  return (
    <TabPane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width={16}>
          {loadingActivities && <LoadingComponent content="Loading events..." />}
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <Card as={Link} to={`/events/${activity.id}`} key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), "do LLL")}</div>
                    <div>{format(new Date(activity.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
});
