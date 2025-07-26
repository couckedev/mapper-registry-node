import {
  createMapper,
  EmptySourceTypeError,
  EmptyTargetTypeError,
} from '../../src';
import { Bar } from '../utils/bar';
import { Foo } from '../utils/foo';

describe('createMapper', () => {
  it(`should throw EmptySourceTypeError if 'from' parameter is empty`, () => {
    //GIVEN empty source type, target type and map function
    const from = '';
    const to = 'Bar';
    const mapFunction = jest.fn();
    //WHEN createMapper is called with source type, target type and map function
    const mapperCreation = () => createMapper(from, to, mapFunction);
    //THEN it should throw EmptySourceTypeError
    expect(mapperCreation).toThrow(new EmptySourceTypeError());
  });
  it(`should throw EmptyTargetTypeError if 'to' parameter is empty`, () => {
    //GIVEN source type, empty target type and map function
    const from = 'Foo';
    const to = '';
    const mapFunction = jest.fn();
    //WHEN createMapper is called with source type, target type and map function
    const mapperCreation = () => createMapper(from, to, mapFunction);
    //THEN it should throw EmptyTargetTypeError
    expect(mapperCreation).toThrow(new EmptyTargetTypeError());
  });
  it('should return object referencing source type, target type and map function', () => {
    //GIVEN source type, target type, and map function
    const from = 'Foo';
    const to = 'Bar';
    const mapFunction = jest.fn();
    const expectedMapperRegistryItem = {
      from,
      to,
      function: mapFunction,
    };
    //WHEN createMapper is called with source type, target type, and map function
    const mapperCreation = createMapper<Foo, Bar>(from, to, mapFunction);
    //THEN it should return MapperRegistryItem referencing from, to and map function
    expect(mapperCreation).toStrictEqual(expectedMapperRegistryItem);
  });
});
