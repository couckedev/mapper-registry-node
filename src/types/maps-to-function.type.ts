export type MapsToFunction<SourceType> = <TargetType>(
  sourceObject: SourceType,
  ...args: unknown[]
) => TargetType;
