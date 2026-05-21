/**
 * Console logger for the admin web — every API call + error flows through here.
 * In production we keep info-level off; in dev we log everything.
 */

const isDev = process.env.NODE_ENV !== 'production';

type LogPayload = Record<string, unknown>;

function ts() {
  return new Date().toISOString();
}

export const logger = {
  debug(msg: string, data?: LogPayload) {
    if (!isDev) return;
    // eslint-disable-next-line no-console
    console.debug(`[${ts()}] [debug] ${msg}`, data ?? '');
  },
  info(msg: string, data?: LogPayload) {
    if (!isDev) return;
    // eslint-disable-next-line no-console
    console.info(`[${ts()}] [info]  ${msg}`, data ?? '');
  },
  warn(msg: string, data?: LogPayload) {
    // eslint-disable-next-line no-console
    console.warn(`[${ts()}] [warn]  ${msg}`, data ?? '');
  },
  error(msg: string, data?: LogPayload) {
    // eslint-disable-next-line no-console
    console.error(`[${ts()}] [error] ${msg}`, data ?? '');
  },
};
