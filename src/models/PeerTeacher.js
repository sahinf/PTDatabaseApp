export default class PeerTeacher {
  constructor(firstname = '', lastname = '', uin = 0) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.uin = uin;
    this.events = [];
    this.assignedLabs = new Set();
  }

  conflictsWith(event) {
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
