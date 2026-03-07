
const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args);
  },

  group: (label: string): void => {
    if (isDev) {
      console.group(label);
    }
  },

  groupEnd: (): void => {
    if (isDev) {
      console.groupEnd();
    }
  },
};
