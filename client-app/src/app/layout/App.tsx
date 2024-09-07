import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import NavBar from "./NavBar";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

function App() {
  const { commonStore, userStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
    userStore.setNavigate(navigate);
  }, [commonStore, userStore, navigate]);

  if (!commonStore.appLoaded) return <LoadingComponent content="Loading app" />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      {!isHomePage && <NavBar />}
      {isHomePage && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      {!isHomePage && (
        <Container style={{ marginTop: isHomePage ? "0" : "7em" }}>
          <Routes>
            <Route path="/activities" element={<ActivityDashboard />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/createActivity" element={<ActivityForm key={location.key} />} />
            <Route path="/manage/:id" element={<ActivityForm key={location.key} />} />
            <Route path="/errors" element={<TestErrors />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      )}
    </>
  );
}

export default observer(App);
