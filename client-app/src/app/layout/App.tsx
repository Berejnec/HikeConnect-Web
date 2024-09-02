import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import NavBar from "./NavBar";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      {!isHomePage && <NavBar />}
      {isHomePage && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<div> Not Found or You do not have permission.</div>} />
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
          </Routes>
        </Container>
      )}
    </>
  );
}

export default observer(App);
