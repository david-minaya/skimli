export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(Date.parse(date));
}
