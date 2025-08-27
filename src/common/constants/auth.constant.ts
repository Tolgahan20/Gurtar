export const AUTH_CONSTANTS = {
  JWT: {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    ISSUER: 'gurtar-api',
    AUDIENCE: 'gurtar-clients',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    RESET_TOKEN_EXPIRY: '1h',
    SALT_ROUNDS: 10,
  },
  VERIFICATION: {
    EMAIL_TOKEN_EXPIRY: '24h',
    PHONE_CODE_EXPIRY: '5m',
    PHONE_CODE_LENGTH: 6,
  },
  OAUTH: {
    GOOGLE: {
      SCOPES: ['email', 'profile'],
      STATE_EXPIRY: '5m',
    },
    FACEBOOK: {
      SCOPES: ['email', 'public_profile'],
      STATE_EXPIRY: '5m',
    },
  },
  RATE_LIMIT: {
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_WINDOW_MINUTES: 15,
    RESET_PASSWORD_MAX_ATTEMPTS: 3,
    RESET_PASSWORD_WINDOW_MINUTES: 60,
  },
} as const;
