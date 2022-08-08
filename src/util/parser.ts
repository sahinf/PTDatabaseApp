import EventInfo from "../models/EventInfo";
import Lab from "../models/Lab";
import PeerTeacher from "../models/PeerTeacher";
import { labStore, ptStore } from "../stores";
import { PeerTeacherImportError } from "./error";
import { get } from "svelte/store"

interface LabSchedule {
    data: {
        courseNumber: string,
        sequenceNumber: string,
        faculty: {
            bannerId: string,
            courseReferenceNumber: string,
            displayName: string,
            emailAddress: string,

        }[],
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
        faculty: {
            bannerId: string,
            courseReferenceNumber: string,
            displayName: string,
            emailAddress: string,

        }[],
        building: string,
        room: string,
        assigned: boolean
    }[],
    peerTeachers: PeerTeacher[]
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
    // TODO email should be parsed from the student's file too I guess, or just end up changing the parser to use survey results for everything, then parse schedules separately.
    const email = "undefined"
    const peerTeacher = new PeerTeacher(uin, firstname, lastname, email);

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
export function parseLabSchedule(schedule: LabSchedule): Lab[] {
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

            results.push(new Lab(courseNumber, sequenceNumber, new EventInfo(days, start, end), building, room, false, course.faculty));
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
export function parseDatabaseLocalStorage(database_string: string) {
    const database = JSON.parse(database_string)
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

/**
 * @param csv csv representation of PT Quentionairre
 * The questionairre collects all sorts of information
 * from Peer Teachers. The `attributes` variable below 
 * houses all of the attributes we want to collect.
 * It looks for those attributes in the header row of the
 * questionnairre to begin populating PT data.
 */
export function parseQuestionnaireCSV(csv: string) {
    const attributes = [
        "Timestamp",
        "UIN",
        "First Name",
        "Last Name",
        "Email Address",
        "Phone Number",
        "Gender",
        "Racial Background",
        "When are you graduating? (Day does not matter)",
        "Classes you CAN peer teach for",
        "Classes you PREFER to peer teach for",
        "Number of hours you prefer to work",
        "Are you a new hire or returning?",
        "Profile picture for website (image)",
        "Schedule (text file)"
    ]
    const sheet = parseCSV(csv);

    const m = mapAttributeToIndex(attributes, sheet[0]);

    const pts = get(ptStore);
    const data = sheet.slice(1, sheet.length);
    data.forEach((row) => {
        const uin = row[m["UIN"]];
        const u = parseInt(uin, 10);
        if (pts.has(u)) {
            const pt = pts.get(u);
            pt.email = row[m["Email Address"]];
            pt.phone_number = row[m["Phone Number"]];
            pt.gender = row[m["Gender"]];
            pt.ethnicity = row[m["Racial Background"]];
            pt.graduation = row[m["When are you graduating? (Day does not matter)"]]
            const c_teach = row[m["Classes you CAN peer teach for"]].split(",").map((val) => parseInt(val));
            // TODO The answers to the questionnaire question "what classes can you peer teach for" needs logic for parsing.It's basically trying to ParseInt("CSCE 110").  
            pt.can_teach = new Set(c_teach)
            const p_teach = row[m["Classes you PREFER to peer teach for"]].split(",").map((val) => parseInt(val));
            pt.pref_teach = new Set(p_teach);
            const hours_work: number = parseInt(row[m["Number of hours you prefer to work"]]);
            pt.pref_work = hours_work;
            pt.new_ret = row[m["Are you a new hire or returning?"]]
            pt.prof_pic_url = row[m["Profile picture for website (image)"]];
            pt.schedule_url = row[m["Schedule (text file)"]];
        }
    })
}

/**
 * 
 * @param csv a string in csv format
 * @returns 2d array representation of CSV file
 */
function parseCSV(csv: string): string[][] {
    const t = csv.split("\n");
    return t.map((val) => {
        const reg = new RegExp(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
        return val.split(reg);
    });
}

/**
 * @param csv csv representation of a Strawpoll output
 * Specific function, should be updated to parse whatever office hour format is being used
 * The current format is a Strawpoll output in csv format
 * It should be a messy function, but it has to be
 * 
 */
export function parseOfficeHours(csv: string) {
    const sheet = parseCSV(csv);
    const begin = sheet.findIndex((row) => row[0].trim().toLowerCase() == "name");
    const end = sheet.findIndex((row) => row[0].trim() == "Total ✓ Votes");
    const pts = get(ptStore);
    for (let i = begin + 1; i < end; i++) {
        const pt_uin = parseInt(sheet[i][0]);
        const pt = pts.get(pt_uin);
        if (pt != undefined || pt != null) {
            console.log("Parsing office hours of pt: ", pt.name)
            parseStrawpollTimesEntry(sheet[i], sheet[begin])
        }
    }
}

/**
 * 
 * @param pt_slots Strawpoll's peer teacher chosen hours row
 * @param time_slots Strawpoll's available office hours row
 * @returns List of office hours (events)
 */
function parseStrawpollTimesEntry(pt_slots: string[], time_slots: string[]): EventInfo[] {
    let res: EventInfo[];
    pt_slots.forEach((val, i) => {
        let start: string, end: string;
        if (val == "1") {
            const regex = /\(([^)]*)\)/; // find value between parantheses eg ($1) find $1
            const match = time_slots[i].match(regex)
            const date_time_form = time_slots[i].split(" ")[0] + `T${match[1].split(" ")[0]}`;
            const date = new Date(date_time_form);

            const map_UTC_day = { 0: "U", 1: "M", 2: "T", 3: "W", 4: "R", 5: "F", 6: "S" };
            const day = map_UTC_day[date.getDay()];

            // TODO previous algorithm fails (maintaining prev/next)
            // const hrs = date.getHours();
            // const min = `0${date.getMinutes()}`.slice(-2); // pad minute with 0
            // start = `${hrs}${min}`;
            // console.log(day, start)
        }
    })
    return res
}

/**
 * @param {Array} attributes Strings of attributes to look for
 * @param {Array} title_row Title row of sheet (usually first row: data[0])
 * @return {Object} [key: attribute, value: index]
 */
function mapAttributeToIndex(attributes: string[], title_row: string[]) {
    return attributes.reduce((prev, curr) => ({
        ...prev,
        [curr]: title_row.findIndex((cell) => cell.toString().toLocaleLowerCase().split(" ").join("").trim() == curr.toLocaleLowerCase().split(" ").join("").trim())
    }), {})
}