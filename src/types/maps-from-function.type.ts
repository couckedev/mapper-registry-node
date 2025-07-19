export type MapsFromFunction<TFrom, TTarget> = (
  fromObject: TFrom,
  ...args: unknown[]
) => TTarget;
