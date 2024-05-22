import { EventType } from "./event-type";
import { Host } from "./host";

export type Event = {
  time: string;
  type: EventType;
  data: Host[];
};
