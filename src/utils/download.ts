export function download(name: string, url: string) {
  const link = document.createElement('a');
  link.download = name;
  link.href = url;
  link.click();
  link.remove();
}
