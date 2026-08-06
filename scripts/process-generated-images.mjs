// One-off script to resize/re-encode AI-generated placeholder images to the
// target dimensions documented in DELIVERABLES.md, as WebP for web delivery.
// Not part of the app build — run manually, then this file can be deleted.
import sharp from "sharp";
import { existsSync } from "node:fs";

const jobs = [
  { in: "public/images/us-home-services-team-onsite.png", out: "public/images/us-home-services-team-onsite.webp", width: 1600, height: 1000 },
  { in: "public/images/houston-tx-skyline.png", out: "public/images/houston-tx-skyline.webp", width: 1600, height: 900 },
  { in: "public/images/austin-tx-skyline.png", out: "public/images/austin-tx-skyline.webp", width: 1600, height: 900 },
  { in: "public/images/healthcare-case-study-cover.png", out: "public/images/healthcare-case-study-cover.webp", width: 1200, height: 800 },
];

for (const job of jobs) {
  if (!existsSync(job.in)) {
    console.log(`Skip (missing): ${job.in}`);
    continue;
  }
  await sharp(job.in)
    .resize(job.width, job.height, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(job.out);
  console.log(`Wrote ${job.out} (${job.width}x${job.height})`);
}
