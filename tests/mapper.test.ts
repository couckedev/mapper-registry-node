import { FunctionNotFoundError, MultipleFunctionsError } from '../src';
import { RELATED_TYPE_TOKEN } from '../src/tokens/related-type.token';
import {
  Bar,
  DummyMapper,
  Foo,
  MapperHavingMultipleMapsFromForSameType,
  MapperHavingMultipleMapsToForSameType,
} from './helpers';

describe('Mapper', () => {
  let mapper: DummyMapper;

  beforeAll(() => {
    mapper = new DummyMapper();
  });

  describe('constructor', () => {
    it('should throw MultipleMethodError if multiple function are decorated with MapsTo for same type', () => {
      //GIVEN mapper class having multipled mapping function decorated with MapsTo declared for same type
      const mapperClass = MapperHavingMultipleMapsToForSameType;
      //WHEN mapper class is instanciated
      const construct = () => new mapperClass();
      //THEN it should throw MultipleFunctionsError
      expect(construct).toThrow(new MultipleFunctionsError('Bar', 'to'));
    });
    it('should throw MultipleMethodError if multiple function are decorated with MapsFrom for same type', () => {
      //GIVEN mapper class having multipled mapping function decorated with MapsTo declared for same type
      const mapperClass = MapperHavingMultipleMapsFromForSameType;
      //WHEN mapper class is instanciated
      const construct = () => new mapperClass();
      //THEN it should throw MultipleFunctionsError
      expect(construct).toThrow(new MultipleFunctionsError('Bar', 'from'));
    });
  });

  describe('getRelatedType', () => {
    it('should return source type metadata set on Mapper', () => {
      //GIVEN mapper decorated with MapperFor and source type
      const relatedTypeMetadata = Reflect.getMetadata(
        RELATED_TYPE_TOKEN,
        mapper.constructor
      ) as string;
      //WHEN getRelatedType is called
      const relatedType = mapper.getRelatedType();
      //THEN it should return source type metadata set on mapper
      expect(relatedType).toStrictEqual(relatedTypeMetadata);
    });
  });

  describe('mapsTo', () => {
    it('should call mapping function related to specified type', () => {
      //GIVEN source object, target type and mapping function related to target type
      const targetType = 'targetType';
      const sourceObject: Foo = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const targetObject: Bar = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const mappingFunctionMock = jest.fn().mockReturnValue(targetObject);
      const resolveMapToMock = jest
        .spyOn(mapper, 'resolveMapTo')
        .mockReturnValueOnce(mappingFunctionMock);
      //WHEN mapsTo is called with source object and target type
      const mapsTo = mapper.mapsTo(sourceObject, targetType);
      //THEN it should call method related to target type and return target object
      expect(resolveMapToMock).toHaveBeenCalledWith(targetType);
      expect(mappingFunctionMock).toHaveBeenCalledWith(sourceObject);
      expect(mapsTo).toStrictEqual(targetObject);
    });
  });

  describe('mapsFrom', () => {
    it('should call mapping function related to type of specified source object', () => {
      //GIVEN some source object and mapping function related to type of this source object
      const sourceObject: Bar = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const targetObject: Foo = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const mappingFunctionMock = jest.fn().mockReturnValue(targetObject);
      const resolveMapFromMock = jest
        .spyOn(mapper, 'resolveMapFrom')
        .mockReturnValueOnce(mappingFunctionMock);
      //WHEN mapsFrom is called with source object
      const mapsFrom = mapper.mapsFrom(sourceObject);
      //THEN it should call method related to type of source object and return target object
      expect(resolveMapFromMock).toHaveBeenCalledWith(typeof sourceObject);
      expect(mappingFunctionMock).toHaveBeenCalledWith(sourceObject);
      expect(mapsFrom).toStrictEqual(targetObject);
    });
  });

  describe('canMapTo', () => {
    it('should return true if specified type has mapping function registered in mapsToMethods', () => {
      //GIVEN type having mapping method registered in mapsToMethods (Bar here)
      const type = 'Bar';
      //WHEN canMapTo is called with this type
      const canMap = mapper.canMap('to', type);
      //THEN it should return true
      expect(canMap).toStrictEqual(true);
    });

    it('should return false if mapsFromMethods has not mapping function for specified type', () => {
      //GIVEN type not registered in mapsToMethods (Baz here)
      const type = 'Baz';
      //WHEN canMapTo is called with this type
      const canMap = mapper.canMap('to', type);
      //THEN it should return false
      expect(canMap).toStrictEqual(false);
    });

    it('should return true if specified type has mapping function registered in mapsFromMethods', () => {
      //GIVEN type having mapping method registered in mapsFromMethods (Bar here)
      const type = 'Bar';
      //WHEN canMapFrom is called with this type
      const canMap = mapper.canMap('from', type);
      //THEN it should return true
      expect(canMap).toStrictEqual(true);
    });

    it('should return false if mapsFromMethods has not mapping function for specified type', () => {
      //GIVEN type not registered in mapsFromMethods (Baz here)
      const type = 'Baz';
      //WHEN canMapFrom is called with this type
      const canMap = mapper.canMap('from', type);
      //THEN it should return false
      expect(canMap).toStrictEqual(false);
    });
  });

  describe('resolveMapTo', () => {
    it('should return mapping function related to specified target type if mapper can map to this target type', () => {
      //GIVEN target type that mapper can map to
      const targetType = 'Bar';
      const foo: Foo = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const mapsToBar = mapper.mapsToBar(foo);
      //WHEN resolveMapTo is called with target type
      const resolveMapTo = mapper.resolveMapTo(targetType);
      //THEN it should return mapping function related to specified target type
      expect(resolveMapTo(foo)).toEqual(mapsToBar);
    });
    it('should throw FunctionNotFoundError if mapper cannot map to specified type', () => {
      //GIVEN target type that mapper cannot map to
      const targetType = 'Baz';
      const relatedType = mapper.getRelatedType();
      //WHEN resolveMapTo is called with target type
      const resolveMapTo = () => mapper.resolveMapTo(targetType);
      //THEN it should throw FunctionNotFoundError
      expect(resolveMapTo).toThrow(
        new FunctionNotFoundError(relatedType, targetType)
      );
    });
  });

  describe('resolveMapFrom', () => {
    it('should return mapping function related to specified source type if mapper can map from this source type', () => {
      //GIVEN source type that mapper can map to
      const sourceType = 'Bar';
      const bar: Bar = {
        prop1: 'prop1',
        prop2: 'prop2',
      };
      const mapsFromBar = mapper.mapsFromBar(bar);
      //WHEN resolveMapFrom is called with source type
      const resolveMapFrom = mapper.resolveMapFrom(sourceType);
      //THEN it should return mapping function related to specified source type
      expect(resolveMapFrom(bar)).toEqual(mapsFromBar);
    });
    it('should throw FunctionNotFoundError if mapper cannot map to specified source type', () => {
      //GIVEN source type that mapper cannot map to
      const sourceType = 'Baz';
      const relatedType = mapper.getRelatedType();
      //WHEN resolveMapFrom is called with source type
      const resolveMapFrom = () => mapper.resolveMapFrom(sourceType);
      //THEN it should throw FunctionNotFoundError
      expect(resolveMapFrom).toThrow(
        new FunctionNotFoundError(sourceType, relatedType)
      );
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
