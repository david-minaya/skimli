export function longDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(Date.parse(date));
}
