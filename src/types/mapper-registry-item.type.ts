import type { MapFunction } from './map-function.type.js';

export type MapperRegistryItem<TFrom, TTo> = {
  from: string;
  to: string;
  function: MapFunction<TFrom, TTo>;
};
