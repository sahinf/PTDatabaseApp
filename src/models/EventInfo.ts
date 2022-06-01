interface EventInfoSerializeInfo {
    days: string,
    start: number,
    end: number
}

export default class EventInfo {
    days: string;
    start: number;
    end: number;

    constructor(days: string, start: number | string, end: number | string) {
        if (typeof start === "string") {
            start = parseInt(start, 10);
        }
        if (typeof end === "string") {
            end = parseInt(end, 10);
        }

        this.days = days;
        this.start = start;
        this.end = end;
    }

    static fromJSON({ days, start, end }: EventInfoSerializeInfo) {
        return new EventInfo(days, start, end);
    }

    static timeToStr(time: number) {
        let hour = Math.floor(time / 100);
        const minute = time % 100;
        const meridiem = (hour < 12) ? 'AM' : 'PM';

        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour -= 12;
        }

        if (minute < 10) {
            return `${hour}:0${minute} ${meridiem}`;
        }
        return `${hour}:${minute} ${meridiem}`;
    }

    conflictsWith(event: EventInfo) {
        const daysConflict = event.days.match(new RegExp(`[${this.days}]`));
        return daysConflict && this.start <= event.end && event.start <= this.end;
    }

    get info() {
        if (this.days === "") {
            return `WEB`;
        } else if (this.start === -1 || this.end === -1) {
            return `${this.days}`;
        } else {
            return `${this.days} ${EventInfo.timeToStr(this.start)}-${EventInfo.timeToStr(this.end)}`;
        }
    }

    get duration_mins() {
        const diff_hours = Math.floor(this.end / 100) - Math.floor(this.start / 100);
        const diff_mins = this.end % 100 - this.start % 100;
        return (diff_hours * 60 + diff_mins) * this.days.length;
    }
}