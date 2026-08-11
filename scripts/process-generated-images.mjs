// Resizes/re-encodes AI-generated placeholder images to the target
// dimensions documented in IMAGE_INVENTORY.md, kept as PNG for delivery
// (project convention — see IMAGE_INVENTORY.md).
//
// Usage: node scripts/process-generated-images.mjs <file> <width> <height>
//   node scripts/process-generated-images.mjs public/images/dallas-tx-skyline.png 1600 900
//
// With no arguments, re-processes the current batch of generated images
// awaiting resize in public/images/pending/ (drop raw ChatGPT downloads
// there; processed files land in public/images/).
import sharp from "sharp";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const DIMENSIONS_BY_SUFFIX = [
  { suffix: "-case-study-cover", width: 1200, height: 800 },
  { suffix: "-skyline", width: 1600, height: 900 },
  { suffix: "-state-hero", width: 1600, height: 900 },
  { suffix: "-featured", width: 1600, height: 900 },
];
const DEFAULT_DIMENSIONS = { width: 1600, height: 1000 }; // industries + services

function guessDimensions(filename) {
  const match = DIMENSIONS_BY_SUFFIX.find((d) => filename.includes(d.suffix));
  return match ?? DEFAULT_DIMENSIONS;
}

async function processFile(inPath, width, height) {
  const dir = path.dirname(inPath).replace(/pending$/, "");
  const base = path.basename(inPath, path.extname(inPath));
  const outPath = path.join(dir, `${base}.png`);
  await sharp(inPath)
    .resize(width, height, { fit: "cover", position: "attention" })
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(outPath);
  console.log(`Wrote ${outPath} (${width}x${height})`);
}

const [, , fileArg, widthArg, heightArg] = process.argv;

if (fileArg) {
  if (!existsSync(fileArg)) {
    console.error(`File not found: ${fileArg}`);
    process.exit(1);
  }
  const width = Number(widthArg) || guessDimensions(fileArg).width;
  const height = Number(heightArg) || guessDimensions(fileArg).height;
  await processFile(fileArg, width, height);
} else {
  const pendingDir = "public/images/pending";
  if (!existsSync(pendingDir)) {
    console.log(`No ${pendingDir} directory and no file argument given — nothing to do.`);
    console.log(`Usage: node scripts/process-generated-images.mjs <file> <width> <height>`);
    process.exit(0);
  }
  const files = readdirSync(pendingDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (files.length === 0) {
    console.log(`${pendingDir} is empty — nothing to do.`);
  }
  for (const file of files) {
    const inPath = path.join(pendingDir, file);
    const { width, height } = guessDimensions(file);
    await processFile(inPath, width, height);
  }
}
