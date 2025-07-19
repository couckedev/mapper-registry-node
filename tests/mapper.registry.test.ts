import {
  MapperAlreadyExistsError,
  MapperNotFoundError,
  MapperRegistry,
} from '../src/index';
import { createMockMapper, DummyMapper } from './helpers';

describe('MapperRegistry', () => {
  describe('createWithMappers', () => {
    it('should instanciate MapperRegistry instance with mappers', () => {
      //GIVEN mapper for source type relatedType
      const relatedType = 'relatedType';
      const mapper = createMockMapper(relatedType);
      const mappers = [mapper];
      //WHEN createWithMappers is called with mappers
      const mapperRegistry = MapperRegistry.createWithMappers(mappers);
      //THEN it should return MapperRegistry instance with mapper
      expect(mapperRegistry).toBeInstanceOf(MapperRegistry);
      expect(mapperRegistry.getMapper(relatedType)).toStrictEqual(mapper);
    });
  });

  describe('register', () => {
    it('should register mapper if a mapper is not still registered for related source type', () => {
      //GIVEN sourcetype, and new mapper related to this source type
      const relatedType = 'relatedType';
      const mapper = createMockMapper(relatedType);
      const mapperRegistry = new MapperRegistry();
      mapperRegistry.register(new DummyMapper());
      //WHEN register method is called with mapper
      mapperRegistry.register(mapper);
      //THEN it should throw MapperAlreadyExistsError
      expect(mapperRegistry.getMapper(relatedType)).toStrictEqual(mapper);
    });
    it('should throw MapperAlreadyExistsError if related source type is already registered with a mapper', () => {
      //GIVEN sourcetype already linked to mapper in registry, and new mapper related to this source type
      const relatedType = 'relatedType';
      const mapper = createMockMapper(relatedType);
      const mapperRegistry = MapperRegistry.createWithMappers([mapper]);
      //WHEN register method is called with mapper
      const mapperRegistration = () => mapperRegistry.register(mapper);
      //THEN it should throw MapperAlreadyExistsError
      expect(mapperRegistration).toThrow(
        new MapperAlreadyExistsError(relatedType)
      );
    });
  });

  describe('getMapper', () => {
    it('should return mapper related to specified source type', () => {
      //GIVEN source type with registered mapper on registry
      const relatedType = 'relatedType';
      const mapper = createMockMapper(relatedType);
      const mapperRegistry = MapperRegistry.createWithMappers([mapper]);
      //WHEN getMapper is called with source type
      const getMapper = mapperRegistry.getMapper(relatedType);
      //THEN it should return mapper
      expect(getMapper).toStrictEqual(mapper);
    });
    it('should throw MapperNotFoundError if specified source type does not have registered mapper', () => {
      //GIVEN source type without registered mapper on registry
      const relatedType = 'relatedType';
      const mapperRegistry = new MapperRegistry();
      //WHEN getMapper is called with source type
      const getMapper = () => mapperRegistry.getMapper(relatedType);
      //THEN it should throw MapperNotFoundError
      expect(getMapper).toThrow(new MapperNotFoundError(relatedType));
    });
  });
});

/*

  getMapper<T>(type: string): Mapper<T> {
    const mapper = this.mappers.get(type);
    if (!mapper) {
      throw new MapperNotFoundError(type);
    }

    return mapper as Mapper<T>;
  }
  */
