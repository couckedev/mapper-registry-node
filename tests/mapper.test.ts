import { MethodNotFoundError } from '../src/method-not-found.error';
import { Foo } from './stubs/foo';
import { fromBarMock, StubMapper, toBarMock } from './stubs/stub.mapper';

describe('Mapper', () => {
  let mapper: StubMapper;

  beforeEach(() => {
    mapper = new StubMapper();
  });

  describe('mapTo', () => {
    it('should return method related to target type', () => {
      //GIVEN target type and Foo input
      const targetType = 'Bar';
      const foo = new Foo('propA', 'propB');
      //WHEN mapTo is called with target type and input
      mapper.mapTo(targetType, foo);
      //THEN method attached to target type in toMap should have been called with input
      expect(toBarMock).toHaveBeenCalledWith(foo);
    });
    it('should throw error if no method has been found for specified target type', () => {
      //GIVEN target type not present in StubMapper toMap and Foo input
      const targetType = 'Baz';
      const foo = new Foo('propA', 'propB');
      //WHEN mapTo is called with target type and input
      const mapTo = () => mapper.mapTo(targetType, foo);
      //THEN method attached to target type in toMap should have been called with input
      expect(mapTo).toThrow(new MethodNotFoundError('Foo', targetType));
    });
  });

  describe('mapFrom', () => {
    it('should return method related to target type', () => {
      //GIVEN target type and Foo input
      const targetType = 'Bar';
      const foo = new Foo('propA', 'propB');
      //WHEN mapFrom is called with target type and input
      mapper.mapFrom(targetType, foo);
      //THEN method attached to target type in fromMap should have been called with input
      expect(fromBarMock).toHaveBeenCalledWith(foo);
    });
    it('should throw error if no method has been found for specified target type', () => {
      //GIVEN target type not present in StubMapper fromMap and Foo input
      const targetType = 'Baz';
      const foo = new Foo('propA', 'propB');
      //WHEN mapFrom is called with target type and input
      const mapFrom = () => mapper.mapFrom(targetType, foo);
      //THEN method attached to target type in fromMap should have been called with input
      expect(mapFrom).toThrow(new MethodNotFoundError(targetType, 'Foo'));
    });
  });
});
