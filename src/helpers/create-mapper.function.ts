import { EmptySourceTypeError } from '../errors/empty-source-type.error.js';
import { EmptyTargetTypeError } from '../errors/empty-target-type.error.js';
import type { MapFunction } from '../types/map-function.type.js';
import type { MapperRegistryItem } from '../types/mapper-registry-item.type.js';

/**
 *
 * @param from Source type
 * @param to Target type
 * @param mapFunction Mapping function
 * @returns Object referencing source type, target type and map function
 */
export function createMapper<TFrom, TTo>(
  from: string,
  to: string,
  mapFunction: MapFunction<TFrom, TTo>
): MapperRegistryItem<TFrom, TTo> {
  if (from.length < 1) {
    throw new EmptySourceTypeError();
  }
  if (to.length < 1) {
    throw new EmptyTargetTypeError();
  }
  return {
    from,
    to,
    function: mapFunction,
  };
}
