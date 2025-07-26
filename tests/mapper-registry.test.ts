import {
  createMapper,
  EmptySourceTypeError,
  EmptyTargetTypeError,
  MapperAlreadyExistsError,
  MapperNotFoundError,
  MapperRegistry,
} from '../src';
import { MapperRegistryItem } from '../src/types/mapper-registry-item.type';
import { Bar } from './utils/bar';
import { Foo } from './utils/foo';

describe('MapperRegistry', () => {
  describe('getMapperKey', () => {
    it(`should throw EmptySourceTypeError if 'from' parameter is empty`, () => {
      //GIVEN empty source type and target type
      const from = '';
      const to = 'Bar';
      //WHEN createMapper is called with source type and target type
      const mapperCreation = () => MapperRegistry.getMapperKey(from, to);
      //THEN it should throw EmptySourceTypeError
      expect(mapperCreation).toThrow(new EmptySourceTypeError());
    });
    it(`should throw EmptyTargetTypeError if 'to' parameter is empty`, () => {
      //GIVEN source type and empty target type
      const from = 'Foo';
      const to = '';
      //WHEN createMapper is called with source type and target type
      const mapperCreation = () => MapperRegistry.getMapperKey(from, to);
      //THEN it should throw EmptyTargetTypeError
      expect(mapperCreation).toThrow(new EmptyTargetTypeError());
    });
    it(`should return (source type)->(target type)`, () => {
      //GIVEN source type and target type
      const from = 'Foo';
      const to = 'Bar';
      const expectedMapperKey = `${from}->${to}`;
      //WHEN getMapperKey is called with source type and target type
      const mapperKey = MapperRegistry.getMapperKey(from, to);
      //THEN it should throw EmptySourceTypeError
      expect(mapperKey).toStrictEqual(expectedMapperKey);
    });
  });

  describe('register', () => {
    it('should throw MapperAlreadyExistsError if mapper to register already exists on registry', () => {
      //GIVE source type, target type, mapper to register and registry already containing this mapper
      const from = 'Foo';
      const to = 'Bar';
      const mapperToRegister = createMapper<Foo, Bar>(from, to, jest.fn());
      const mapperRegistry = MapperRegistry.createWithMappers([
        mapperToRegister,
      ]);
      //WHEN register is called with mapper to register
      const mapperRegistration = () =>
        mapperRegistry.register(mapperToRegister);
      //THEN it should throw MapperAlreadyExistsError
      expect(mapperRegistration).toThrow(
        new MapperAlreadyExistsError(from, to)
      );
    });
    it('should register mapper', () => {
      //GIVEN source type, target type and mapper to register and registry
      const from = 'Foo';
      const to = 'Bar';
      const mapperToRegister = createMapper<Foo, Bar>(from, to, jest.fn());
      const mapperRegistry = new MapperRegistry();
      //WHEN register is called with mapper to register
      mapperRegistry.register(mapperToRegister);
      //THEN it should throw MapperAlreadyExistsError
      expect(mapperRegistry.getMapperWith(from, to)).toStrictEqual(
        mapperToRegister
      );
    });
  });

  describe('createWithMappers', () => {
    it('should return MapperRegistry instance with mappers to register', () => {
      //GIVEN source type, target type and mapper to register
      const from = 'Foo';
      const to = 'Bar';
      const mapperToRegister = createMapper<Foo, Bar>(from, to, jest.fn());
      //WHEN createWithMappers is called
      const mapperRegistry = MapperRegistry.createWithMappers([
        mapperToRegister,
      ]);
      //THEN it should return instance of MapperRegistry with registered mapper
      expect(mapperRegistry).toBeInstanceOf(MapperRegistry);
      expect(mapperRegistry.getMapperWith(from, to)).toStrictEqual(
        mapperToRegister
      );
    });
  });

  describe('getMapperWith', () => {
    it('should return registered mapper corresponding to source type and target type', () => {
      //GIVEN source type, target type and mapper registry with registered mapper for source type and target type
      const from = 'Foo';
      const to = 'Bar';
      const registeredMapper = createMapper<Foo, Bar>(from, to, jest.fn());
      const mapperRegistry = MapperRegistry.createWithMappers([
        registeredMapper,
      ]);
      //WHEN getMapperWith is called with source type and target type
      const getMapperWith = mapperRegistry.getMapperWith(from, to);
      //THEN it should return registered mapper
      expect(getMapperWith).toStrictEqual(registeredMapper);
    });
    it('should return undefined if mapper has not been found for source type and target type', () => {
      //GIVEN source type, target type, and mapper registry without registered mapper for these source type and target type
      const from = 'Foo';
      const to = 'Bar';
      const mapperRegistry = new MapperRegistry();
      //WHEN getMapperWith is called with source type and target type
      const getMapperWith = mapperRegistry.getMapperWith(from, to);
      //THEN it should return undefined
      expect(getMapperWith).toBeUndefined();
    });
  });

  describe('maps', () => {
    it('should throw MapperNotFoundError if mapper for specified source type and target type has not been found on mapper registry', () => {
      //GIVEN source type, target type, and no mapper found with them
      const from = 'Foo';
      const to = 'Bar';
      const foo: Foo = {
        propA: 'propA',
        propB: 'propB',
      };
      const mapperRegistry = new MapperRegistry();
      const getMapperWithSpy = jest
        .spyOn(mapperRegistry, 'getMapperWith')
        .mockReturnValue(undefined);
      //WHEN maps is called with source type and target type
      const maps = () => mapperRegistry.maps<Foo, Bar>(from, to, foo);
      //THEN it should throw MapperNotFoundError
      expect(maps).toThrow(new MapperNotFoundError(from, to));
      expect(getMapperWithSpy).toHaveBeenCalledWith(from, to);
    });
    it('should call map function registered on mapper registry for source type and target type', () => {
      //GIVEN source type, target type, and no mapper found with them
      const from = 'Foo';
      const to = 'Bar';
      const object: Foo = {
        propA: 'propA',
        propB: 'propB',
      };
      const mapFunctionMock = jest.fn();
      const registeredMapper: MapperRegistryItem<unknown, Bar> = {
        from,
        to,
        function: mapFunctionMock,
      };
      const mapperRegistry = new MapperRegistry();
      const getMapperWithSpy = jest
        .spyOn(mapperRegistry, 'getMapperWith')
        .mockReturnValue(registeredMapper);
      //WHEN maps is called with source type and target type
      mapperRegistry.maps<Foo, Bar>(from, to, object);
      //THEN it should execute map function with object
      expect(getMapperWithSpy).toHaveBeenCalledWith(from, to);
      expect(mapFunctionMock).toHaveBeenCalledWith(object);
    });
  });
  /*

  maps<TFrom, TTo>(from: string, to: string, object: TFrom): TTo {
    const mapper = this.getMapperWith<TFrom, TTo>(from, to);
    if (!mapper) {
      throw new MapperNotFoundError(from, to);
    }
    return mapper.function(object);
  }
  */
});
