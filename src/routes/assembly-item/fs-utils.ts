// import path from 'path';
import { path, fs, shell } from '@tauri-apps/api';

interface LineItem {
  name: string;
}

export const getFullPath = async (rootDir: string, lineItem: LineItem, index: number) => {
  const parts = lineItem.name.split('-').map((part) => part.trim());

  // Extract base name (everything before the first dash)
  const baseName = parts[0].split(' ').slice(0, -1).join('_').toLowerCase();

  // Extract color (second part if it exists, otherwise 'default')
  const color = parts[1] ? parts[1].toLowerCase().replace(/\s+/g, '_') : 'default';

  // Extract size (third part if it exists, otherwise empty string)
  let size = (parts[2] || '').toLowerCase().replace(/\s+/g, '_');
  size = size === 'xlarge' ? 'xl' : size;

  // Construct filename
  const filename = [baseName, color, size, `${index}`].filter(Boolean).join('_') + '.arxp';

  // Construct full path
  const fullPath = await path.join(rootDir, baseName, color, filename);

  return fullPath;
};

export const doesFileExist = async (path: string) => {
  return await fs.exists(path);
};

export const openFile = async (file: string) => {
  await shell.open(file);
};
