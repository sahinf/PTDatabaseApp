import type EventInfo from "./EventInfo";

export default class PeerTeacher {
    id: number;
    firstname: string;
    lastname: string;
    events: EventInfo[];
    labs: Set<number>;

    constructor(id: number | string, firstname: string, lastname: string) {
        if(typeof id === "string") {
            id = parseInt(id, 10);
        }

        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.events = [];
        this.labs = new Set();
    }
}