import { observer } from "mobx-react-lite";
import React from "react";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityFilters() {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();
  return (
    <>
      <Menu vertical size="large" style={{ width: "100%", marginTop: 29 }}>
        <Header icon="filter" attached="top" color="teal" content="Filters"></Header>
        <Menu.Item
          content="All Activities"
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
        ></Menu.Item>
        <Menu.Item
          content="I'm going"
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
        ></Menu.Item>
        <Menu.Item
          content="I'm hosting"
          active={predicate.has("isHost")}
          onClick={() => setPredicate("isHost", "true")}
        ></Menu.Item>
      </Menu>
      <Header></Header>
      <Calendar
        onChange={(value) => setPredicate("startDate", value as Date)}
        value={predicate.get("startDate") || new Date()}
      />
    </>
  );
});
