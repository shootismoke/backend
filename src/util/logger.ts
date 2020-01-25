import { captureException } from '@sentry/node';

/**
 * Send an error to Sentry, or if sentry is not set up, just log it
 * @param error - Error to log
 */
function error(error: Error): void {
  if (process.env.SENTRY_DSN) {
    captureException(error);
  } else {
    console.error(error.message);
  }
}

export const logger = {
  error
};
