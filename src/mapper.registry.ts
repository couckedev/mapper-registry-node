import { Mapper } from './mapper';
import { MapperNotFoundError } from './mapper-not-found.error';

export class MapperRegistry {
  private readonly mappers = new Map<string, Mapper<unknown>>();

  constructor(mappers: Mapper<unknown>[]) {
    mappers.map(mapper => {
      this.register(mapper);
    });
  }

  private register(mapper: Mapper<unknown>) {
    const sourceType = mapper.getSourceType();
    this.mappers.set(sourceType, mapper);
  }

  getMapperForType(type: string): Mapper<unknown> {
    const mapper = this.mappers.get(type);
    if (!mapper) {
      throw new MapperNotFoundError(type);
    }

    return mapper;
  }
}
