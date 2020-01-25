import Sentry from '@sentry/node';

function debug(message: string): void {
  if (!process.env.SENTRY_DSN) {
    console.log(message);
  }
}

function error(error: Error): void {
  if (!process.env.SENTRY_DSN) {
    console.error(error.message);
  } else {
    Sentry.captureException(error);
  }
}

export const logger = {
  debug,
  error
};
