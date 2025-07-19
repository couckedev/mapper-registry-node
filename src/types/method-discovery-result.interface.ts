import { MapsFromFunction } from './maps-from-function.type';
import { MapsToFunction } from './maps-to-function.type';

export interface MethodDiscoveryResult<T, TFrom = unknown> {
  name: string;
  method: MapsToFunction<T> | MapsFromFunction<T, TFrom>;
  type: string;
}
