import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourcePath = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destPath = join(outDir, 'entry.png');

const buf = readFileSync(sourcePath);
if (buf.length === 0 || buf.length > 1_048_576) {
  throw new Error(`Invalid entry.png size: ${buf.length}`);
}

const isPng =
  buf.length >= 8 &&
  buf[0] === 0x89 &&
  buf[1] === 0x50 &&
  buf[2] === 0x4e &&
  buf[3] === 0x47 &&
  buf[4] === 0x0d &&
  buf[5] === 0x0a &&
  buf[6] === 0x1a &&
  buf[7] === 0x0a;
const isJpeg = buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png must be a valid PNG or JPEG image');
}

mkdirSync(outDir, { recursive: true });
copyFileSync(sourcePath, destPath);
