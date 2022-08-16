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
    phone_number: string,
    gender: string,
    ethnicity: string,
    graduation: string,
    can_teach: number[],
    pref_teach: number[],
    pref_work: number,
    new_ret: string,
    prof_pic_url: string,
    schedule_url: string,
    office_hours: {
        days: string,
        start: number,
        end: number
    }[]
}

export default class PeerTeacher {
    id: number;
    firstname: string;
    lastname: string;
    events: EventInfo[];
    labs: Set<number>;
    email: string;
    phone_number: string;
    gender: string;
    ethnicity: string;
    graduation: string;
    can_teach: Set<number>;
    pref_teach: Set<number>;
    pref_work: number;
    new_ret: string;
    prof_pic_url: string;
    schedule_url: string;
    office_hours: EventInfo[];

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
        this.events = [];
    }

    static fromJSON(qt: PeerTeacherSerializeInfo) {
        const { id, firstname, lastname, events, labs, email, office_hours } = qt;
        const pt = new PeerTeacher(id, firstname, lastname, email);
        pt.events = events.map(e => EventInfo.fromJSON(e));
        pt.labs = new Set(labs);
        pt.email = qt.email;
        pt.phone_number = qt.phone_number;
        pt.gender = qt.gender;
        pt.ethnicity = qt.ethnicity;
        pt.graduation = qt.graduation;
        pt.can_teach = new Set(qt.can_teach);
        pt.pref_teach = new Set(qt.pref_teach);
        pt.pref_work = qt.pref_work;
        pt.new_ret = qt.new_ret;
        pt.prof_pic_url = qt.prof_pic_url;
        pt.schedule_url = qt.schedule_url;
        pt.office_hours = office_hours?.map(e => EventInfo.fromJSON(e));

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
            total_hours += all_labs?.get(lab_id)?.pay_hours ?? 0;
        })
        return total_hours;
    }

    // The public URL for displaying an an image on Google Drive has to be in this format
    // This function simply replaces everthing before '=' with ''
    get drive_pic(): string {
        if (this.prof_pic_url == null || this.prof_pic_url == undefined) return ""
        return `https://drive.google.com/uc?export=view&id=${this.prof_pic_url.replace(/^[^=]*=/, '')}`;
    }

    get phone(): string {
        if (this.phone_number)
            return `${this?.phone_number.substring(0, 3)}-${this?.phone_number.substring(3, 6)}-${this?.phone_number.substring(6, 10)}`;
    }

}