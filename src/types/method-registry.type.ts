import { MapsFromFunction } from './maps-from-function.type';
import { MapsToFunction } from './maps-to-function.type';

export type MethodRegistry<T, TFrom = unknown> = Map<
  string,
  MapsToFunction<T> | MapsFromFunction<T, TFrom>
>;
