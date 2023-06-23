import { getAspectRatio } from "./video-utils";

const tt = [
  { width: 500, heigth: 320, ratio: "custom" },
  { width: 640, heigth: 480, ratio: "custom" },
  { width: 1280, heigth: 720, ratio: "16:9" },
  { width: 1920, heigth: 1080, ratio: "16:9" },
  { width: 2560, heigth: 1440, ratio: "16:9" },
  { width: 2048, heigth: 1080, ratio: "custom" },
  { width: 320, heigth: 320, ratio: "1:1" },
  { width: 7680, heigth: 4320, ratio: "16:9" },
];

function main() {
  for (const t of tt) {
    const expectedRatio = getAspectRatio(t.width, t.heigth);
    if (expectedRatio != t.ratio) {
      console.log(t, expectedRatio);
      console.warn("failed test ...");
      break;
    }
  }
}

// main();
