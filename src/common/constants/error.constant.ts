export const ERROR_CONSTANTS = {
  VALIDATION: {
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PHONE: 'Invalid phone number format',
    INVALID_PASSWORD:
      'Password must be at least 8 characters long and contain at least one number and one special character',
    INVALID_DATE: 'Invalid date format',
    INVALID_COORDINATES: 'Invalid coordinates',
    INVALID_PRICE: 'Price must be greater than 0',
    INVALID_STOCK: 'Stock must be greater than 0',
    INVALID_DISCOUNT: 'Discount must be between 30% and 90%',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED:
      'Account temporarily locked due to too many failed attempts',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    UNAUTHORIZED: 'Unauthorized access',
    EMAIL_NOT_VERIFIED: 'Email not verified',
  },
  BUSINESS: {
    NOT_FOUND: 'Business not found',
    INVALID_SUBSCRIPTION: 'Invalid or expired subscription',
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
    INVALID_PAYOUT_AMOUNT: 'Invalid payout amount',
    MAX_WORKERS_REACHED: 'Maximum number of workers reached',
  },
  PACKAGE: {
    NOT_FOUND: 'Package not found',
    OUT_OF_STOCK: 'Package out of stock',
    RESERVATION_EXPIRED: 'Reservation has expired',
    INVALID_PICKUP_TIME: 'Invalid pickup time',
    ALREADY_PICKED_UP: 'Package already picked up',
  },
  PAYMENT: {
    FAILED: 'Payment processing failed',
    INVALID_AMOUNT: 'Invalid payment amount',
    PROVIDER_ERROR: 'Payment provider error',
    REFUND_FAILED: 'Refund processing failed',
    DUPLICATE_PAYMENT: 'Duplicate payment detected',
  },
} as const;
