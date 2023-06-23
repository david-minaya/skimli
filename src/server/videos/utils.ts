import { Readable } from "stream";

export const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const decodeS3Key = (key: string) => {
  return decodeURIComponent(key.replace(/\+/g, " "));
};

export function parseS3URL(sourceUrl: string): {
  bucket: string;
  key: string;
} {
  const url = new URL(sourceUrl);
  const bucket = url.hostname;
  const key = decodeS3Key(url.pathname.substring(1));
  return { key, bucket };
}
