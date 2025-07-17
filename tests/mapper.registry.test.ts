import { MapperNotFoundError } from '../src/mapper-not-found.error';
import { MapperRegistry } from '../src/index';
import { StubMapper } from './stubs/stub.mapper';

describe('Mapper', () => {
  let mapper: StubMapper;
  let mapperRegistry: MapperRegistry;

  beforeEach(() => {
    mapper = new StubMapper();
    mapperRegistry = new MapperRegistry([mapper]);
  });

  describe('getMapperForType', () => {
    it('should return mapper related to source type from mapper', () => {
      //GIVEN source type from mapper
      const sourceType = mapper.getSourceType();
      //WHEN getMapperForType is called with source type
      const returnedMapper = mapperRegistry.getMapperForType(sourceType);
      //THEN returned mapper should be the StubMapper
      expect(returnedMapper).toStrictEqual(mapper);
    });

    it('should throw MapperNotFoundError if mapper has not been found for specified source type', () => {
      //GIVEN source type from mapper
      const sourceType = 'someTypeWithoutMapper';
      //WHEN getMapperForType is called with source type
      const getMapperForType = () =>
        mapperRegistry.getMapperForType(sourceType);
      //THEN returned mapper should be the StubMapper
      expect(getMapperForType).toThrow(new MapperNotFoundError(sourceType));
    });
  });
});
