export function formatSeconds(time: number, withMilliseconds = false) {

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  return (
    `${hours ? `${format(hours)}:` : ''}` +
    `${format(minutes)}:` +
    `${format(seconds, withMilliseconds)}`
  );
}

function format(time: number, withMilliseconds = false) {
  return !withMilliseconds
    ? Math.round(time).toString().padStart(2, '0')
    : time.toFixed(3).padStart(6, '0');
}
