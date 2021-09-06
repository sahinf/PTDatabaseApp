import type EventInfo from "./EventInfo";

export default class Lab {
    id: number;
    course: number;
    section: number;
    event: EventInfo;
    building: string;
    room: string;

    constructor(course: number | string, section: number | string, event: EventInfo, building = "", room = "") {
        if(typeof course === "string") {
            course = parseInt(course, 10);
        }
        if(typeof section === "string") {
            section = parseInt(section, 10);
        }

        this.id = parseInt(`${course}${section}`, 10);
        this.course = course;
        this.section = section;
        this.event = event;
        this.building = building;
        this.room = room;
    }

    get time() {
        return this.event.info;
    }

    get location() {
        return `${this.building}-${this.room}`;
    }
}