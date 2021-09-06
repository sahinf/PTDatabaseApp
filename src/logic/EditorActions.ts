import { parseLabSchedule, parsePTSchedule } from "../util/parser";

export async function parsePTFile(file: File) {
    try {
        const text = await file.text();
        return parsePTSchedule(text);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}

export async function parseLabScheduleFile(file: File) {
    const text = await file.text();
    try {
        const labSchedule = JSON.parse(text);
        return parseLabSchedule(labSchedule);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}
