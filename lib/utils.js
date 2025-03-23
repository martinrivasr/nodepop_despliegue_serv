import { createRequire } from 'node:module';

export const require = createRequire(import.meta.url);

// Node < 20.11
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// export const __filename = fileURLToPath(import.meta.url);
// export const __dirname = dirname(__filename);
// Node >= 20.11
export const __filename = import.meta.filename
export const __dirname = import.meta.dirname
