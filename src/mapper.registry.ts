import { MapperAlreadyExistsError } from './errors/mapper-already-exists.error';
import { MapperNotFoundError } from './errors/mapper-not-found.error';
import { Mapper } from './mapper';
import { MapperConstructor } from './types/mapper-constructor.type';

export class MapperRegistry {
  private readonly mapperConstructors = new Map<
    string,
    MapperConstructor<unknown>
  >();

  constructor(mapperConstructors: MapperConstructor<unknown>[]) {
    this.register(mapperConstructors);
  }

  private register(mapperConstructors: MapperConstructor<unknown>[]) {
    for (const MapperConstructor of mapperConstructors) {
      const sourceType = MapperConstructor.getSourceType();

      if (this.mapperConstructors.has(sourceType)) {
        throw new MapperAlreadyExistsError(sourceType);
      }

      this.mapperConstructors.set(sourceType, MapperConstructor);
    }
  }

  map<T>(type: string, object: T): Mapper<T> {
    const MapperConstructor = this.mapperConstructors.get(type);
    if (!MapperConstructor) {
      throw new MapperNotFoundError(type);
    }

    return new MapperConstructor(object) as Mapper<T>;
  }

  getMapperConstructor<T = unknown>(type: string): MapperConstructor<T> {
    const constructor = this.mapperConstructors.get(type);
    if (!constructor) {
      throw new MapperNotFoundError(type);
    }
    return constructor as MapperConstructor<T>;
  }
}
