import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" style={{ color: "white" }}>
          <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 12 }} />
          HikeConnect
        </Header>
        {userStore.isLoggedIn ? (
          <>
            <Header as="h2" inverted content="Welcome to HikeConnect" />
            <Button as={Link} to="/events" size="huge" primary content="Go to Events" />
          </>
        ) : (
          <>
            <Button onClick={() => modalStore.openModal(<LoginForm />)} size="huge" inverted content="Login!" />
            <Button onClick={() => modalStore.openModal(<RegisterForm />)} size="huge" inverted content="Register!" />
          </>
        )}
      </Container>
    </Segment>
  );
});
