// constants/permission.constant.ts
export const Permissions = {
  // User permissions
  USER_CREATE: 1,
  USER_READ: 2,
  USER_UPDATE: 3,
  USER_DELETE: 4,

  // Book permissions
  BOOK_CREATE: 11,
  BOOK_READ: 12,
  BOOK_UPDATE: 13,
  BOOK_DELETE: 14,

  // Stock permissions
  STOCK_CREATE: 21,
  STOCK_READ: 22,
  STOCK_UPDATE: 23,
  STOCK_DELETE: 24,

  // Rent permissions
  RENT_CREATE: 31,
  RENT_READ: 32,
  RENT_UPDATE: 33,
  RENT_DELETE: 34,

  // Author permissions
  AUTHOR_CREATE: 41,
  AUTHOR_READ: 42,
  AUTHOR_UPDATE: 43,
  AUTHOR_DELETE: 44,
} as const;
