import { MapsFromFunction } from './maps-from-function.type';
import { MapsToFunction } from './maps-to-function.type';

export interface MethodDiscoveryResult<RelatedType, TFrom = unknown> {
  name: string;
  method:
    | MapsToFunction<RelatedType, TFrom>
    | MapsFromFunction<TFrom, RelatedType>;
  type: string;
}
