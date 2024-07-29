import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import NavBar from "./NavBar";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <NavBar />}
      <Container style={{ marginTop: isHomePage ? "0" : "7em" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ActivityDashboard />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/createActivity" element={<ActivityForm key={location.key} />} />
          <Route path="/manage/:id" element={<ActivityForm key={location.key} />} />
        </Routes>
      </Container>
    </>
  );
}

export default observer(App);
