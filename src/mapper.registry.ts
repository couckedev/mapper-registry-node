import { MapperAlreadyExistsError } from './errors/mapper-already-exists.error';
import { MapperNotFoundError } from './errors/mapper-not-found.error';
import { Mapper } from './mapper';
import { IMapper } from './types/mapper.interface';

export class MapperRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly mappers = new Map<string, IMapper<any>>();

  static createWithMappers(mappers: IMapper<unknown>[]): MapperRegistry {
    const mapperRegistry = new MapperRegistry();
    for (const mapper of mappers) {
      mapperRegistry.register(mapper);
    }
    return mapperRegistry;
  }

  register<RelatedType = unknown>(mapper: IMapper<RelatedType>) {
    const relatedType = mapper.getRelatedType();

    if (this.mappers.has(relatedType)) {
      throw new MapperAlreadyExistsError(relatedType);
    }

    this.mappers.set(relatedType, mapper);
  }

  getMapper<T>(type: string): Mapper<T> {
    const mapper = this.mappers.get(type);
    if (!mapper) {
      throw new MapperNotFoundError(type);
    }

    return mapper as Mapper<T>;
  }
}
