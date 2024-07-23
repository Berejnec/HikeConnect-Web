import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default function NavBar() {
  const { activityStore } = useStore();

  return (
    <Menu inverted fixed="top" className="shadow">
      <Container>
        <Menu.Item header className="d-flex gap-3">
          <img src="/assets/logo.png" alt="logo" />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button positive content="Create Activity" onClick={() => activityStore.openForm()} />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
