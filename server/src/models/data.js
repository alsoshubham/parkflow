import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.json');

// Initialize from file
let dbData = { users: [], lots: [], bookings: [], payments: [], sessions: [], notifications: [] };
try {
  if (fs.existsSync(dataPath)) {
    dbData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
} catch (error) {
  console.error("Error reading data.json:", error);
}

const save = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(dbData, null, 2));
  } catch (error) {
    console.error("Error writing to data.json:", error);
  }
};

const genId = (prefix) => `${prefix}-${uuid().slice(0,8)}`;

export const db = new Proxy(dbData, {
  get(target, prop) {
    if (prop === 'save') return save;
    if (prop === 'genId') return genId;
    return target[prop];
  }
});
