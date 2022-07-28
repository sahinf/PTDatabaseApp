import { parseDatabase, parseLabSchedule, parsePTSchedule, parseQuestionairreCSV } from "../util/parser";

export async function parsePTFile(file: File) {
    try {
        const text = await file.text();
        return parsePTSchedule(text);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}

export async function readQuestionairre(file: File) {
    try {
        const text = await file.text();
        return parseQuestionairreCSV(text);
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

export async function parseDatabaseFile(file: File) {
    const text = await file.text();
    try {
        const database = JSON.parse(text);
        return parseDatabase(database);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}
