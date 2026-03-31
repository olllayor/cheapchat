import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { app } from 'electron/main';

export function getAppIconPath(): string | undefined {
  const candidates = app.isPackaged
    ? [join(process.resourcesPath, 'assets', 'icon.png')]
    : [join(app.getAppPath(), 'build', 'icon.png'), join(process.cwd(), 'build', 'icon.png')];

  return candidates.find((candidate) => existsSync(candidate));
}
