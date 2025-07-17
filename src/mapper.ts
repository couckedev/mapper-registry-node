import { MethodNotFoundError } from './method-not-found.error';

export abstract class Mapper<TSource> {
  constructor() {
    this.initMapper();
  }

  protected readonly toMap = new Map<string, (input: unknown) => unknown>();
  protected readonly fromMap = new Map<string, (input: unknown) => unknown>();
  abstract getSourceType(): string;
  abstract initMapper(): void;

  mapTo(targetType: string, input: TSource): unknown {
    const fn = this.toMap.get(targetType);
    if (!fn) {
      const sourceType = this.getSourceType();
      throw new MethodNotFoundError(sourceType, targetType);
    }
    return fn(input);
  }

  mapFrom(targetType: string, input: unknown): TSource {
    const fn = this.fromMap.get(targetType) as (input: unknown) => TSource;
    if (!fn) {
      const sourceType = this.getSourceType();
      throw new MethodNotFoundError(targetType, sourceType);
    }
    return fn(input);
  }
}
