import EventInfo from './EventInfo';

export default class PeerTeacher {
  firstname: string;

  lastname: string;

  uin: number;

  events: EventInfo[];

  assignedLabs: Set<string>;

  constructor(firstname = '', lastname = '', uin = 0) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.uin = uin;
    this.events = [];
    this.assignedLabs = new Set();
  }

  conflictsWith(event: EventInfo) {
    let conflicts = false;
    this.events.every((item) => {
      if (item.conflictsWith(event)) {
        conflicts = true;
        return false;
      }
      return true;
    });
    return conflicts;
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }

  get id() {
    return this.uin;
  }
}
