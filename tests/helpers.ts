import { Mapper, MapperFor, MapsFrom, MapsTo } from '../src';
import { IMapper } from '../src/types/mapper.interface';

export const createMockMapper = <RelatedType>(
  relatedType: string
): IMapper<RelatedType> => {
  return {
    canMap: jest.fn(),
    mapsFrom: jest.fn(),
    mapsTo: jest.fn(),
    getRelatedType: () => relatedType,
    resolveMapTo: jest.fn(),
    resolveMapFrom: jest.fn(),
  };
};

export type Foo = {
  readonly prop1: string;
  readonly prop2: string;
};

export type Bar = Foo;
export type Baz = Foo;

const mapsFromBarMock = jest.fn();
const mapsToBarMock = jest.fn();

@MapperFor('Foo')
export class DummyMapper extends Mapper<Foo> {
  @MapsFrom('Bar')
  mapsFromBar(bar: Bar): Foo {
    return mapsFromBarMock(bar) as Foo;
  }

  @MapsTo('Bar')
  mapsToBar(foo: Foo): Bar {
    return mapsToBarMock(foo) as Bar;
  }
}

@MapperFor('Foo')
export class MapperHavingMultipleMapsToForSameType extends Mapper<Foo> {
  @MapsTo('Bar')
  mapsToBar(foo: Foo): Bar {
    return mapsToBarMock(foo) as Bar;
  }

  @MapsTo('Bar')
  mapsToBar2(foo: Foo): Bar {
    return mapsToBarMock(foo) as Bar;
  }
}

@MapperFor('Foo')
export class MapperHavingMultipleMapsFromForSameType extends Mapper<Foo> {
  @MapsFrom('Bar')
  mapsFromBar(foo: Foo): Bar {
    return mapsToBarMock(foo) as Bar;
  }

  @MapsFrom('Bar')
  mapsFromBar2(foo: Foo): Bar {
    return mapsToBarMock(foo) as Bar;
  }
}
