export function getRangeDate(date: [string, string]) {
  const from_n = new Date(date[0]);

  const ranges = [date[0]];

  if (date[0] === date[1]) {
    return ranges;
  }

  for (let i = 0; i < 366; i++) {
    from_n.setDate(from_n.getDate() + 1);
    const day = from_n.toISOString().slice(0, 10);

    ranges.push(day);

    if (day === date[1]) {
      return ranges;
    }
  }

  return ranges;
}

export function getDateAfter(day: number, date = new Date()) {
  date.setDate(date.getDate() + day);

  return date;
}

export function getDateBefore(day: number, date = new Date()) {
  date.setDate(date.getDate() - day);

  return date;
}

export function getDateAfterYear(year = 1, date = new Date()) {
  date.setMonth(date.getMonth() + year * 12);

  return date;
}

export function getDateISOString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getYYMMDDDateFromIsoFormat(isoDate: string) {
  return `${isoDate.slice(2, 4)}${isoDate.split('-').slice(1).join('')}`;
}

export function getStartOfDay(date = new Date()) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export function getEndOfDay(date = new Date()) {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(0);
  return date;
}

export function getTodayRange() {
  return {
    from: getStartOfDay(new Date()),
    untill: getEndOfDay(new Date()),
  };
}

export function getTimezoned(date = new Date(), offset: number) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
}

export function getTomorrowRange(date = new Date()) {
  const tomorrows_date = getDateAfter(1, date);

  return {
    from: getStartOfDay(tomorrows_date),
    untill: getEndOfDay(tomorrows_date),
  };
}

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getDateDifferenceInDays(date1: Date, date2: Date): number {
  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  // Convert milliseconds to days
  const daysDifference = Math.ceil(timeDifference / ONE_DAY_IN_MS);
  return daysDifference;
}
