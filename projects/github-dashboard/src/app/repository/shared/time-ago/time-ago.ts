import {interval, Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';

/** Inspired by https://github.com/AndrewPoyntz/time-ago-pipe/blob/master/time-ago.pipe.ts */
export function dateTimeToString(): (dateTime$: Observable<string>) => Observable<string> {
  return (dateTime$: Observable<string>) => {
    return dateTime$.pipe(switchMap(dateTime => {
      return interval(getUpdateIntervalInMs(dateTime))
          .pipe(startWith(null), map(() => transformDateTimeToString(dateTime)));
    }));
  };
}

function getSeconds(dateTime: string) {
  const d = new Date(dateTime);
  const now = new Date();
  return Math.ceil(Math.abs((now.getTime() - d.getTime()) / 1000));
}

function getUpdateIntervalInMs(dateTime: string) {
  const numSeconds = getSeconds(dateTime);
  const oneMinute = 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  let secondsUntilUpdate = 3600;  // Default update to update every hour

  if (numSeconds < oneMinute) {
    secondsUntilUpdate = 2;
  } else if (numSeconds < oneHour) {
    secondsUntilUpdate = 30;
  } else if (numSeconds < oneDay) {
    secondsUntilUpdate = 5 * 60;  // five minutes
  }

  return secondsUntilUpdate * 1000;
}

function transformDateTimeToString(dateTime: string) {
  const seconds = getSeconds(dateTime);
  const minutes = Math.round(Math.abs(seconds / 60));
  const hours = Math.round(Math.abs(minutes / 60));
  const days = Math.round(Math.abs(hours / 24));
  const months = Math.round(Math.abs(days / 30.416));
  const years = Math.round(Math.abs(days / 365));

  if (seconds <= 45) {
    return 'a few seconds ago';
  } else if (seconds <= 90) {
    return 'a minute ago';
  } else if (minutes <= 45) {
    return minutes + ' minutes ago';
  } else if (minutes <= 90) {
    return 'an hour ago';
  } else if (hours <= 22) {
    return hours + ' hours ago';
  } else if (hours <= 36) {
    return 'a day ago';
  } else if (days <= 25) {
    return days + ' days ago';
  } else if (days <= 45) {
    return 'a month ago';
  } else if (days <= 345) {
    return months + ' months ago';
  } else if (days <= 545) {
    return 'a year ago';
  } else {  // (days > 545)
    return years + ' years ago';
  }
}
