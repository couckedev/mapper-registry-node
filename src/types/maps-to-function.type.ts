export type MapsToFunction<TFrom, TTarget> = (
  sourceObject: TFrom,
  ...args: unknown[]
) => TTarget;
