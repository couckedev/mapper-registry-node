import { Mapper, MapperFor } from '../../src';
import { MapsFrom } from '../../src/decorators/maps-from.decorator';
import { MapsTo } from '../../src/decorators/maps-to.decorator';
import { Foo } from './foo';

export const toBarMock = jest.fn();
export const fromBarMock = jest.fn();

@MapperFor('Foo')
export class StubMapper extends Mapper<Foo> {
  @MapsFrom('Bar')
  fromBar() {}

  @MapsTo('Bar')
  toBar() {}
}
