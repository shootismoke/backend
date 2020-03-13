import { captureException, init } from '@sentry/node';

import { IS_SENTRY_SET_UP } from './constants';

/**
 * Set up Sentry, if available.
 */
export function sentrySetup(): void {
  if (process.env.SENTRY_DSN) {
    init({
      dsn: process.env.SENTRY_DSN
    });
  }
}

/**
 * List of errors that we don't want to send to Sentry, as not to spam it.
 */
const excludedErrors = ['No user with expoInstallationId'];

/**
 * Send an error to Sentry, or if sentry is not set up, just log it.
 *
 * @param error - Error to log
 */
function error(error: Error): void {
  if (
    IS_SENTRY_SET_UP &&
    !excludedErrors.some(msg => error.message.includes(msg))
  ) {
    captureException(error);
  } else {
    console.error(error.message);
  }
}

export const logger = {
  error
};
