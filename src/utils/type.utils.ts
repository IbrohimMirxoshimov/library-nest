export type ClassImplementation<T> = {
  [K in keyof T]?: T[K];
};
