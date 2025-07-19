export type MapsFromFunction<SourceType, FromType> = (
  fromObject: FromType,
  ...args: unknown[]
) => SourceType;
