export function toSeconds(time: string) {
  const [hours, minutes, seconds] = time.split(':');
  return (
    parseFloat(hours) * 60 * 60 + 
    parseFloat(minutes) * 60 +
    parseFloat(seconds)
  );
}
