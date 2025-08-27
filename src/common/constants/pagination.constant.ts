export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SORT_ORDER: {
    ASC: 'ASC',
    DESC: 'DESC',
  } as const,
  SORT_FIELDS: {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    PRICE: 'price',
    RATING: 'rating',
    DISTANCE: 'distance',
  } as const,
} as const;
