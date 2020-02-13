/**
 * Is development?
 */
export const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Is production?
 */
export const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Is Sentry set up?
 */
export const IS_SENTRY_SET_UP = !!process.env.SENTRY_DSN;
