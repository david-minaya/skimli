export function formatSeconds(time: number) {

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  return (
    `${hours ? `${format(hours)}:` : ''}` +
    `${format(minutes)}:` +
    `${format(seconds)}`
  )
}

function format(time: number) {
  return Math.trunc(time).toString().padStart(2, '0');
}
