import { Direction } from './direction.type';
import { MapsFromFunction } from './maps-from-function.type';
import { MapsToFunction } from './maps-to-function.type';

export interface IMapper<RelatedType> {
  getRelatedType(): string;
  resolveMapTo<TTo>(type: string): MapsToFunction<RelatedType, TTo>;
  resolveMapFrom<TFrom>(type: string): MapsFromFunction<TFrom, RelatedType>;
  mapsTo<TTo>(object: RelatedType, targetType: string): TTo;
  mapsFrom<TFrom>(sourceObject: TFrom): RelatedType;
  canMap(direction: Direction, type: string): boolean;
}
