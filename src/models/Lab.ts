import { assign } from "svelte/internal";
import EventInfo from "./EventInfo";

interface LabSerializeInfo {
    course: number,
    section: number,
    event: {
        days: string,
        start: number,
        end: number
    },
    building: string,
    room: string,
    assigned: boolean
}

export default class Lab {
    id: number;
    course: number;
    section: number;
    event: EventInfo;
    building: string;
    room: string;
    assigned: boolean;

    constructor(course: number | string, section: number | string, event: EventInfo, building = "", room = "", assigned = false) {
        if (typeof course === "string") {
            course = parseInt(course, 10);
        }
        if (typeof section === "string") {
            section = parseInt(section, 10);
        }

        this.id = parseInt(`${course}${section}`, 10);
        this.course = course;
        this.section = section;
        this.event = event;
        this.building = building;
        this.room = room;
        this.assigned = assigned;
    }

    static fromJSON({ course, section, event, building, room, assigned }: LabSerializeInfo) {
        return new Lab(course, section, EventInfo.fromJSON(event), building, room, assigned);
    }

    get time() {
        return this.event.info;
    }

    get location() {
        return `${this.building}-${this.room}`;
    }
}