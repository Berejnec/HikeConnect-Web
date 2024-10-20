import { observer } from "mobx-react-lite";
// import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Calendar } from "@/components/ui/calendar";

export default observer(function ActivityFilters() {
  const {
    activityStore: { predicate, setPredicate },
  } = useStore();
  return (
    <>
      <Menu vertical size="large" style={{ width: "100%", marginTop: 29 }} className="border">
        <Header icon="filter" attached="top" content="Filters"></Header>
        <Menu.Item
          content="All Events"
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
      <div className="w-full bg-white rounded-md">
        <Calendar
          mode="single"
          selected={predicate.get("startDate") || new Date()}
          onSelect={(value) => (value ? setPredicate("startDate", value as Date) : null)}
          className="rounded-md border shadow-lg w-full"
          classNames={{
            months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            row: "w-full mt-2",
          }}
        />
      </div>
    </>
  );
});
