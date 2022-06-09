import EventInfo from "../models/EventInfo";
import Lab from "../models/Lab";
import PeerTeacher from "../models/PeerTeacher";
import { labStore, ptStore } from "../stores";
import { PeerTeacherImportError } from "./error";

interface LabSchedule {
    data: {
        courseNumber: string,
        sequenceNumber: string,
        meetingsFaculty: {
            meetingTime: {
                beginTime: string | null,
                building: string,
                endTime: string | null,
                friday: boolean,
                meetingType: string,
                monday: boolean,
                room: string,
                thursday: boolean,
                tuesday: boolean,
                wednesday: boolean
            }
        }[],
        sectionAttributes: {
            description: string
        }[]
    }[]
};

interface DatabaseFile {
    labs: {
        id: number,
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
    }[],
    peerTeachers: {
        id: number,
        firstname: string,
        lastname: string,
        events: {
            days: string,
            start: number,
            end: number
        }[],
        labs: number[]
    }[]
}

/**
 * Parses a peer teacher schedule
 * @param schedule The schedule to parse
 * @returns A peer teacher
 */
export function parsePTSchedule(schedule: string) {
    // namePatter: <firstname> <lastname> <uin>
    const namePattern = /^(.*?)\s(.*)\s(\d{9})/;
    // eventPattern (24hr time): MTWRF hh:mm - hh:mm
    const eventPattern = /^(M?T?W?R?F?)\s(\d{1,2}:\d{2})\s?-\s?(\d{1,2}:\d{2})/;
    const lines = schedule.split("\n").filter(line => line.trim());

    const nameLine = lines.find(line => line.match(namePattern));
    if (nameLine === undefined) {
        throw new PeerTeacherImportError(`No peer teacher in schedule`);
    }

    const [, firstname, lastname, uin] = nameLine.match(namePattern) as RegExpMatchArray;
    const peerTeacher = new PeerTeacher(uin, firstname, lastname);

    const events = lines
        .filter(line => line.match(eventPattern))
        .map(line => {
            let [, days, start, end] = line.match(eventPattern) as RegExpMatchArray;
            start = start.replace(":", "");
            end = end.replace(":", "");
            return new EventInfo(days, start, end);
        });

    peerTeacher.events = events;
    return peerTeacher;
}

/**
 * Parses the course schedule into labs attended by PTs
 * @param schedule The course schedule object from Howdy
 * @returns An array of labs
 */
export function parseLabSchedule(schedule: LabSchedule) {
    const taughtCourses = ['110', '111', '120', '121', '206', '221', '312', '313', '315', '331'];
    const results: Lab[] = [];

    const courses = schedule.data;
    for (const course of courses) {
        if (!taughtCourses.includes(course.courseNumber) || course.sectionAttributes[0].description === "McAllen") {
            continue;
        }

        for (const meeting of course.meetingsFaculty) {
            const { meetingTime } = meeting;

            if (meetingTime.meetingType !== "LAB") {
                continue;
            }

            let days = "";
            days += meetingTime.monday ? 'M' : '';
            days += meetingTime.tuesday ? 'T' : '';
            days += meetingTime.wednesday ? 'W' : '';
            days += meetingTime.thursday ? 'R' : '';
            days += meetingTime.friday ? 'F' : '';

            const start = meetingTime.beginTime === null ? -1 : meetingTime.beginTime;
            const end = meetingTime.endTime === null ? -1 : meetingTime.endTime;
            const { courseNumber, sequenceNumber } = course;
            const { building, room } = meetingTime;

            results.push(
                new Lab(
                    courseNumber,
                    sequenceNumber,
                    new EventInfo(days, start, end),
                    building,
                    room
                )
            );
        }
    }

    return results;
}

/**
 * Parses a database file into maps of Lab and PeerTeacher objects
 * @param database The database object from a database file
 * @returns And object with lab and peer teacher maps
 */
export function parseDatabase(database: DatabaseFile) {
    const result = {
        labs: new Map<number, Lab>(),
        peerTeachers: new Map<number, PeerTeacher>()
    }

    database.labs.forEach(lab => {
        result.labs.set(lab.id, Lab.fromJSON(lab));
    });

    database.peerTeachers.forEach(pt => {
        result.peerTeachers.set(pt.id, PeerTeacher.fromJSON(pt));
    });

    return result;
}

/**
 * Parses a JSON database into maps of Lab and Peer Teachers
 * and updates local storage
 * @param database The database object from a db file
 */
export function parseDatabaseLocal(database: DatabaseFile) {
    const result = {
        labs: new Map<number, Lab>(),
        peerTeachers: new Map<number, PeerTeacher>()
    }

    database.labs.forEach(lab => {
        result.labs.set(lab.id, Lab.fromJSON(lab));
    });

    database.peerTeachers.forEach(pt => {
        result.peerTeachers.set(pt.id, PeerTeacher.fromJSON(pt));
    });

    labStore.set(result.labs);
    ptStore.set(result.peerTeachers)
}