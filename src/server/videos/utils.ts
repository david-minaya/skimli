import { Readable } from "stream";
import * as _l from "lodash";

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

export function deepCompare({
  object,
  other,
  ignore,
}: {
  object: any;
  other: any;
  ignore: string[];
}) {
  const customizer: _l.IsEqualCustomizer = (
    _: any,
    __: any,
    key: _l.PropertyName | undefined
  ) => {
    if (ignore.includes(key as any)) {
      return true;
    }
    return undefined;
  };

  const sortedObject = JSON.parse(JSON.stringify(object ?? {}));
  const sortedOther = JSON.parse(JSON.stringify(other ?? {}));

  return _l.isEqualWith(
    _l.omit(sortedObject, ...ignore),
    _l.omit(sortedOther, ...ignore),
    customizer
  );
}

export function recursiveRemoveKey(object: object, deleteKey: string) {
  delete object[deleteKey];

  Object.values(object).forEach((val) => {
    if (typeof val !== "object") return;

    recursiveRemoveKey(val, deleteKey);
  });
}
