/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptySourceTypeError } from './errors/empty-source-type.error';
import { EmptyTargetTypeError } from './errors/empty-target-type.error';
import { MapperAlreadyExistsError } from './errors/mapper-already-exists.error';
import { MapperNotFoundError } from './errors/mapper-not-found.error';
import type { MapperRegistryItem } from './types/mapper-registry-item.type';

export class MapperRegistry {
  private readonly mappers = new Map<string, MapperRegistryItem<any, any>>();

  static getMapperKey(from: string, to: string) {
    if (from.length < 1) {
      throw new EmptySourceTypeError();
    }
    if (to.length < 1) {
      throw new EmptyTargetTypeError();
    }
    return `${from}->${to}`;
  }

  register<TFrom, TTo>(mapper: MapperRegistryItem<TFrom, TTo>) {
    const existingMapper = this.getMapperWith(mapper.from, mapper.to);
    if (existingMapper) {
      throw new MapperAlreadyExistsError(mapper.from, mapper.to);
    }
    this.mappers.set(
      MapperRegistry.getMapperKey(mapper.from, mapper.to),
      mapper
    );
  }

  static createWithMappers(
    mappers: MapperRegistryItem<any, any>[]
  ): MapperRegistry {
    const instance = new MapperRegistry();
    mappers.map(mapper => instance.register(mapper));
    return instance;
  }

  getMapperWith<TFrom, TTo>(
    from: string,
    to: string
  ): MapperRegistryItem<TFrom, TTo> | undefined {
    return this.mappers.get(MapperRegistry.getMapperKey(from, to));
  }

  maps<TFrom, TTo>(from: string, to: string, object: TFrom): TTo {
    const mapper = this.getMapperWith<TFrom, TTo>(from, to);
    if (!mapper) {
      throw new MapperNotFoundError(from, to);
    }
    return mapper.function(object);
  }
}
