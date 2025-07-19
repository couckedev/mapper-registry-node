import { MethodNotFoundError } from './errors/method-not-found.error';
import { MultipleMethodError } from './errors/not-single-method.error';
import { UndefinedFromTypeError } from './errors/undefined-from-type.error';
import { UndefinedSourceType } from './errors/undefined-source-type.error';
import { UndefinedToTypeError } from './errors/undefined-to-type.error';
import { FROM_TYPE_TOKEN } from './tokens/from-type.token';
import { SOURCE_TYPE_TOKEN } from './tokens/source-type.token';
import { TO_TYPE_TOKEN } from './tokens/to-type.token';
import { Direction } from './types/direction.type';
import { MapsFromFunction } from './types/maps-from-function.type';
import { MapsToFunction } from './types/maps-to-function.type';
import { MethodDiscoveryResult } from './types/method-discovery-result.interface';
import { MethodRegistry } from './types/method-registry.type';

export abstract class Mapper<TSource> {
  private readonly mapsToMethods: MethodRegistry<TSource> = new Map();
  private readonly mapsFromMethods: MethodRegistry<TSource> = new Map();

  constructor(public readonly source: TSource) {
    this.initializeMethods();
  }

  /**
   * Gets the source type from metadata
   */
  static getSourceType(): string {
    const sourceType = Reflect.getMetadata(SOURCE_TYPE_TOKEN, this) as
      | string
      | undefined;

    if (!sourceType) {
      throw new UndefinedSourceType();
    }

    return sourceType;
  }

  /**
   * Maps the source object to the specified target type
   */
  to<TTarget>(targetType: string): TTarget {
    const method = this.mapsToMethods.get(targetType) as
      | MapsToFunction<TSource>
      | undefined;

    if (!method) {
      const currentSourceType = (
        this.constructor as typeof Mapper
      ).getSourceType();
      throw new MethodNotFoundError(currentSourceType, targetType);
    }

    return method<TTarget>(this.source);
  }

  /**
   * Maps from the specified source type to the current type
   * (This method would need implementation based on your use case)
   */
  from<TFrom>(sourceType: string, sourceObject: TFrom): TSource {
    const method = this.mapsFromMethods.get(sourceType) as
      | MapsFromFunction<TSource, TFrom>
      | undefined;

    if (!method) {
      const currentSourceType = (
        this.constructor as typeof Mapper
      ).getSourceType();
      throw new MethodNotFoundError(sourceType, currentSourceType);
    }

    // This assumes MapsFromFunction signature needs adjustment
    return method(sourceObject);
  }

  /**
   * Gets all available target types for mapping
   */
  getAvailableTargetTypes(): string[] {
    return Array.from(this.mapsToMethods.keys());
  }

  /**
   * Gets all available source types for mapping
   */
  getAvailableSourceTypes(): string[] {
    return Array.from(this.mapsFromMethods.keys());
  }

  /**
   * Checks if mapping to a specific type is available
   */
  canMapTo(targetType: string): boolean {
    return this.mapsToMethods.has(targetType);
  }

  /**
   * Checks if mapping from a specific type is available
   */
  canMapFrom(sourceType: string): boolean {
    return this.mapsFromMethods.has(sourceType);
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

    methods.forEach(({ name, method, type }) => {
      this.validateMethodType(type, name, direction);
      this.validateUniqueMethod(type, direction, registry);
      registry.set(type, method);
    });
  }

  /**
   * Discovers methods with the appropriate metadata
   */
  private getMethodsWithMetadata(
    direction: Direction
  ): MethodDiscoveryResult<TSource>[] {
    const instance = this.getPrototypeWithMethods();
    const token = direction === 'to' ? TO_TYPE_TOKEN : FROM_TYPE_TOKEN;
    const results: MethodDiscoveryResult<TSource>[] = [];

    Object.getOwnPropertyNames(instance).forEach(name => {
      const method = instance[name];

      if (this.isValidMapFunction(method)) {
        const type = Reflect.getMetadata(token, method) as string | undefined;

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
  private getPrototypeWithMethods(): Mapper<TSource> & Record<string, unknown> {
    return Object.getPrototypeOf(this) as Mapper<TSource> &
      Record<string, unknown>;
  }

  /**
   * Validates that the method type is properly defined
   */
  private validateMethodType(
    type: string,
    methodName: string,
    direction: Direction
  ): void {
    if (!type || type.length === 0) {
      if (direction === 'to') {
        throw new UndefinedToTypeError(methodName);
      } else {
        throw new UndefinedFromTypeError(methodName);
      }
    }
  }

  /**
   * Validates that only one method exists for each type
   */
  private validateUniqueMethod(
    type: string,
    direction: Direction,
    registry: MethodRegistry<TSource>
  ): void {
    if (registry.has(type)) {
      throw new MultipleMethodError(type, direction);
    }
  }

  /**
   * Type guard for mapping functions
   */
  private isValidMapFunction<TFrom = unknown>(
    value: unknown
  ): value is MapsToFunction<TSource> | MapsFromFunction<TSource, TFrom> {
    return typeof value === 'function';
  }
}
