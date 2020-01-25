import { captureException } from '@sentry/node';

function debug(message: string): void {
  if (!process.env.SENTRY_DSN) {
    console.log(message);
  }
}

function error(error: Error): void {
  if (process.env.SENTRY_DSN) {
    captureException(error);
  } else {
    console.error(error.message);
  }
}

export const logger = {
  debug,
  error
};
