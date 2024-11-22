export function enumEntires(entity: object) {
  const e = Object.entries(entity);

  return e.filter((e) => isNaN(parseInt(e[0])));
}

export function arrayToMap<T>(
  arr: T[],
  keyGetter: (item: T) => string | number,
) {
  return arr.reduce(
    (pv, cv) => {
      return {
        ...pv,
        [keyGetter(cv)]: cv,
      };
    },
    {} as Record<string | number, T>,
  );
}

// Does JSON.stringify, with support for BigInt (irreversible)
export function toJsonWithSupportBigInt(data: any) {
  if (data !== undefined) {
    return JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? `${v}n` : v,
    ).replace(/"(-?\d+)n"/g, (_, a) => a);
  }
}

export function omitProperty<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj;
  return rest as Omit<T, K>;
}
