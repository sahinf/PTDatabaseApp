export class PeerTeacherImportError extends Error {
    constructor(message) {
        super(message);
        this.name = "PeerTeacherImportError";
    }
}