export function toTime(time: number) {

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;

  return (
    `${Math.trunc(hours).toString().padStart(2, '0')}:` +
    `${Math.trunc(minutes).toString().padStart(2, '0')}:` +
    `${seconds.toFixed(2).padStart(5, '0')}`
  );
}
