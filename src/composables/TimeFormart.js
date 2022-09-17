import i18n from '@plugins/i18n';

const timeMessage = (time) => {
  return i18n.global.t(`nav.notification.time.${time}`)
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date?.toDate()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ` ${timeMessage('year')}`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ` ${timeMessage('month')}`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ` ${timeMessage('day')}`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ` ${timeMessage('hours')}`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ` ${timeMessage('minutes')}`;
  }
  return timeMessage('now');
}

export { timeSince };
