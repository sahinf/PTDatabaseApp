export default class EventInfo {
  constructor(days = '', start = 0, end = 0) {
    this.days = days;
    this.start = start;
    this.end = end;
  }

  static timeToStr(time) {
    let hour = Math.floor(time / 100);
    let minute = time % 100;
    const meridiem = (hour < 12) ? 'AM' : 'PM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    if (minute < 10) {
      minute = `0${minute}`;
    }

    return `${hour}:${minute} ${meridiem}`;
  }

  conflictsWith(event) {
    const daysConflict = event.days.match(new RegExp(`[${this.days}]`));

    if (daysConflict) {
      return (this.start <= event.end) && (event.start <= this.end);
    }
    return false;
  }

  get info() {
    if (this.days === '') {
      return 'ONLINE';
    }
    return `${this.days} ${EventInfo.timeToStr(this.start)}-${EventInfo.timeToStr(this.end)}`;
  }
}
