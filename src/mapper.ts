import { FunctionNotFoundError } from './errors/function-not-found.error';
import { MultipleFunctionsError } from './errors/multiple-functions.error';
import { FROM_TYPE_TOKEN } from './tokens/from-type.token';
import { RELATED_TYPE_TOKEN } from './tokens/related-type.token';
import { TO_TYPE_TOKEN } from './tokens/to-type.token';
import { Direction } from './types/direction.type';
import { IMapper } from './types/mapper.interface';
import { MapsFromFunction } from './types/maps-from-function.type';
import { MapsToFunction } from './types/maps-to-function.type';
import { MethodDiscoveryResult } from './types/method-discovery-result.interface';

export abstract class Mapper<RelatedType> implements IMapper<RelatedType> {
  private readonly mapsToMethods: Map<
    string,
    MapsToFunction<RelatedType, unknown>
  > = new Map();
  private readonly mapsFromMethods: Map<
    string,
    MapsFromFunction<unknown, RelatedType>
  > = new Map();

  constructor() {
    this.initializeMethods();
  }

  resolveMapTo<TTarget>(type: string): MapsToFunction<RelatedType, TTarget> {
    if (!this.canMap('to', type)) {
      const currentRelatedType = this.getRelatedType();
      throw new FunctionNotFoundError(currentRelatedType, type);
    }
    return this.mapsToMethods.get(type) as MapsToFunction<RelatedType, TTarget>;
  }

  resolveMapFrom<TFrom>(type: string): MapsFromFunction<TFrom, RelatedType> {
    if (!this.canMap('from', type)) {
      const currentRelatedType = this.getRelatedType();
      throw new FunctionNotFoundError(type, currentRelatedType);
    }
    return this.mapsFromMethods.get(type) as unknown as MapsFromFunction<
      TFrom,
      RelatedType
    >;
  }
  /**
   * Gets the source type from metadata
   */
  getRelatedType(): string {
    const relatedType = Reflect.getMetadata(
      RELATED_TYPE_TOKEN,
      this.constructor
    ) as string;
    return relatedType;
  }

  /**
   * Maps the source object to the specified target type
   */
  mapsTo<TTarget>(object: RelatedType, targetType: string): TTarget {
    const method = this.resolveMapTo<TTarget>(targetType);
    return method(object);
  }

  /**
   * Maps from the specified source type to the current type
   * (This method would need implementation based on your use case)
   */
  mapsFrom<TFrom>(fromObject: TFrom): RelatedType {
    const fromType = typeof fromObject;
    const method = this.resolveMapFrom<typeof fromObject>(fromType);
    return method(fromObject);
  }

  canMap(direction: Direction, type: string): boolean {
    const registry =
      direction === 'to' ? this.mapsToMethods : this.mapsFromMethods;
    return registry.has(type);
  }

  /**
   * Initializes both mapping method registries
   */
  private initializeMethods(): void {
    this.discoverMethods('to');
    this.discoverMethods('from');
  }

  /**
   * Discovers and registers mapping methods based on direction
   */
  private discoverMethods(direction: Direction): void {
    const methods = this.getMethodsWithMetadata(direction);
    const registry =
      direction === 'to' ? this.mapsToMethods : this.mapsFromMethods;

    methods.forEach(({ method, type }) => {
      this.validateUniqueMethod(type, direction, registry);
      if (direction === 'to') {
        this.mapsToMethods.set(type, method);
      } else {
        this.mapsFromMethods.set(
          type,
          method as MapsFromFunction<unknown, RelatedType>
        );
      }
    });
  }

  /**
   * Discovers methods with the appropriate metadata
   */
  private getMethodsWithMetadata(
    direction: Direction
  ): MethodDiscoveryResult<RelatedType>[] {
    const instance = this.getPrototypeWithMethods();
    const token = direction === 'to' ? TO_TYPE_TOKEN : FROM_TYPE_TOKEN;
    const results: MethodDiscoveryResult<RelatedType>[] = [];

    Object.getOwnPropertyNames(instance).forEach(name => {
      const method = instance[name];

      if (this.isValidMapFunction(method)) {
        const type = Reflect.getMetadata(token, method) as string;

        if (type !== undefined) {
          results.push({ name, method, type });
        }
      }
    });

    return results;
  }

  /**
   * Gets the prototype with all methods
   */
  private getPrototypeWithMethods(): Mapper<RelatedType> &
    Record<string, unknown> {
    return Object.getPrototypeOf(this) as Mapper<RelatedType> &
      Record<string, unknown>;
  }

  /**
   * Validates that only one method exists for each type
   */
  private validateUniqueMethod<TTarget>(
    type: string,
    direction: Direction,
    registry: Map<
      string,
      | MapsToFunction<RelatedType, TTarget>
      | MapsFromFunction<TTarget, RelatedType>
    >
  ): void {
    if (registry.has(type)) {
      throw new MultipleFunctionsError(type, direction);
    }
  }

  /**
   * Type guard for mapping functions
   */
  private isValidMapFunction<TTarget>(
    value: unknown
  ): value is
    | MapsToFunction<RelatedType, TTarget>
    | MapsFromFunction<TTarget, RelatedType> {
    return typeof value === 'function';
  }
}
