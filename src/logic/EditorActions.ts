import { parseDatabase, parseLabSchedule, parsePTSchedule, parseQuestionnaireCSV, parseOfficeHours } from "../util/parser";

export async function parsePTFile(file: File) {
    try {
        const text = await file.text();
        return parsePTSchedule(text);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}

export async function readQuestionnaire(file: File) {
    try {
        const text = await file.text();
        return parseQuestionnaireCSV(text);
    } catch (error) {
        console.error(file.name, error);
        throw error;
    }
}

export async function parseOfficeHoursFile(file: File) {
    try {
        const text = await file.text();
        return parseOfficeHours(text);
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
