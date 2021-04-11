import EventInfo from '@/models/EventInfo';

export default class Lab {
  constructor(course = 0, section = 0, event = new EventInfo()) {
    this.course = course;
    this.section = section;
    this.event = event;
  }

  get id() {
    return `${this.course}-${this.section}`;
  }

  get fullInfo() {
    return `${this.id} ${this.event.info}`;
  }
}
