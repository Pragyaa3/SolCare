import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'data');
const uploadDir = path.resolve(process.cwd(), 'uploads');

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {}
}

async function readJson(fileName, fallback) {
  await ensureDir(dataDir);
  const filePath = path.join(dataDir, fileName);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await writeJson(fileName, fallback ?? []);
      return fallback ?? [];
    }
    throw e;
  }
}

async function writeJson(fileName, data) {
  await ensureDir(dataDir);
  const filePath = path.join(dataDir, fileName);
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmpPath, filePath);
}

async function saveUpload(file, destName) {
  await ensureDir(uploadDir);
  const destPath = path.join(uploadDir, destName);
  await fs.writeFile(destPath, Buffer.from(await file.arrayBuffer()));
  return destPath;
}

export const db = {
  readEmergencies: () => readJson('emergencies.json', []),
  writeEmergencies: (data) => writeJson('emergencies.json', data),
  readLoans: () => readJson('loans.json', []),
  writeLoans: (data) => writeJson('loans.json', data),
  readAppointments: () => readJson('appointments.json', []),
  writeAppointments: (data) => writeJson('appointments.json', data),
  readUsers: () => readJson('users.json', []),
  writeUsers: (data) => writeJson('users.json', data),
  saveUpload,
};

export function generateId(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}
