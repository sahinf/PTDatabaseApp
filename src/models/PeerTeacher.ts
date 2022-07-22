import EventInfo from "./EventInfo";
import { labStore } from "../stores";
import { get } from "svelte/store"

interface PeerTeacherSerializeInfo {
    id: number,
    firstname: string,
    lastname: string,
    events: {
        days: string,
        start: number,
        end: number
    }[],
    labs: number[],
    email: string,
}

export default class PeerTeacher {
    id: number;
    firstname: string;
    lastname: string;
    events: EventInfo[];
    labs: Set<number>;
    email: string;

    constructor(id: number | string, firstname: string, lastname: string, email: string) {
        if (typeof id === "string") {
            id = parseInt(id, 10);
        }

        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.events = [];
        this.labs = new Set();
        this.email = email;
    }

    static fromJSON({ id, firstname, lastname, events, labs, email }: PeerTeacherSerializeInfo) {
        const pt = new PeerTeacher(id, firstname, lastname, email);
        pt.events = events.map(e => EventInfo.fromJSON(e));
        pt.labs = new Set(labs);
        return pt;
    }

    conflictsWith(event: EventInfo) {
        const all_labs = get(labStore);
        const lab_events: EventInfo[] = [...this.labs.values()].flatMap((lab_id) => {
            const lab = all_labs.get(lab_id);
            return lab != undefined ? lab.event : [];
        })
        return lab_events.some((e) => e.conflictsWith(event)) ||
            this.events.some(item => item.conflictsWith(event));
    }

    get name(): string {
        return `${this.firstname} ${this.lastname}`;
    }

    get lab_hours(): number {
        const all_labs = get(labStore);

        let total_hours = 0;
        this.labs.forEach((lab_id) => {
            total_hours += all_labs.get(lab_id)!.pay_hours;
        })

        return total_hours;
    }

}