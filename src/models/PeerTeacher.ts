import EventInfo from "./EventInfo";

interface PeerTeacherSerializeInfo {
    id: number,
    firstname: string,
    lastname: string,
    events: {
        days: string,
        start: number,
        end: number
    }[],
    labs: number[]
}

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

    static fromJSON({id, firstname, lastname, events, labs}: PeerTeacherSerializeInfo) {
        const pt = new PeerTeacher(id, firstname, lastname);
        pt.events = events.map(e => EventInfo.fromJSON(e));
        pt.labs = new Set(labs);
        return pt;
    }

    conflictsWith(event: EventInfo) {
        return this.events.some(item => item.conflictsWith(event));
    }

    get name() {
        return `${this.firstname} ${this.lastname}`;
    }
}