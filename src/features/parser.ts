import Lab from '@/models/Lab';
import PeerTeacher from '@/models/PeerTeacher';
import EventInfo from '../models/EventInfo';

export async function parseLabFile(file: File): Promise<Lab[]> {
  const validCourses = [
    '110',
    '111',
    '121',
    '206',
    '221',
    // '222',
    '312',
    '313',
    // '314',
    '315',
  ];
  const result: Lab[] = [];

  const text = await file.text();
  let jsonData;
  try {
    jsonData = JSON.parse(text);
  } catch (e) {
    throw new Error(e);
  }
  const labs = jsonData.data;

  labs.forEach((lab: any) => {
    if (validCourses.includes(lab.courseNumber)) {
      const newLab = new Lab(lab.courseNumber, lab.sequenceNumber);

      lab.meetingsFaculty.every((meeting: any) => {
        const { meetingTime } = meeting;

        if (meetingTime.meetingType === 'LAB') {
          let days = '';
          days += meetingTime.monday ? 'M' : '';
          days += meetingTime.tuesday ? 'T' : '';
          days += meetingTime.wednesday ? 'W' : '';
          days += meetingTime.thursday ? 'R' : '';
          days += meetingTime.friday ? 'F' : '';

          newLab.event.days = days;
          newLab.event.start = parseInt(meetingTime.beginTime, 10);
          newLab.event.end = parseInt(meetingTime.endTime, 10);

          return false;
        }

        return true;
      });

      result.push(newLab);
    }
  });

  return result;
}

export async function parsePtSchedule(file: File): Promise<PeerTeacher> {
  const text = await file.text();
  const peerTeacher = new PeerTeacher();
  // namePatter: <firstname> <lastname> <uin>
  const namePattern = /^(.*)\s(.*)\s(\d{9})/;
  // eventPattern (24hr time): MTWRF hh:mm - hh:mm
  const eventPattern = /^(M?T?W?R?F?)\s(\d{1,2}:\d{2})\s?-\s?(\d{1,2}:\d{2})/;
  const lines = text.split('\n').filter((line) => line.trim());

  lines.forEach((line) => {
    const ptName = line.match(namePattern);
    if (ptName) {
      [, peerTeacher.firstname, peerTeacher.lastname] = ptName;
      peerTeacher.uin = parseInt(ptName[3], 10);
    }

    const eventMatch = line.match(eventPattern);
    if (eventMatch) {
      const newEvent = new EventInfo(eventMatch[1]);
      newEvent.start = parseInt(eventMatch[2].replace(':', ''), 10);
      newEvent.end = parseInt(eventMatch[3].replace(':', ''), 10);
      peerTeacher.events.push(newEvent);
    }
  });

  return peerTeacher;
}

export async function parsePtDatabase(file: File): Promise<{
  labs: Map<string, Lab>,
  peerTeachers: Map<number, PeerTeacher>
}> {
  const text = await file.text();
  const jsonObj = JSON.parse(text);
  const result = {
    labs: new Map(),
    peerTeachers: new Map(),
  };

  Object.keys(jsonObj.labs).forEach((key) => {
    const { course, section, event: { days, start, end } } = jsonObj.labs[key];
    result.labs.set(key, new Lab(course,
      section, new EventInfo(days, start, end)));
  });

  Object.keys(jsonObj.peerTeachers).forEach((key) => {
    const pt = jsonObj.peerTeachers[key];
    const ptObj = new PeerTeacher(pt.firstname, pt.lastname, pt.uin);
    ptObj.events = pt.events.map((eventObj: any) => new EventInfo(eventObj.days,
      eventObj.start, eventObj.end));
    ptObj.assignedLabs = new Set();
    pt.assignedLabs.forEach((labId: string) => {
      ptObj.assignedLabs.add(labId);
    });
    result.peerTeachers.set(key, ptObj);
  });

  return result;
}
