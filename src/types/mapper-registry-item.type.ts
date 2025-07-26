import { MapFunction } from './map-function.type';

export type MapperRegistryItem<TFrom, TTo> = {
  from: string;
  to: string;
  function: MapFunction<TFrom, TTo>;
};
