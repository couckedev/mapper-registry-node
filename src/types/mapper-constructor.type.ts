import { Mapper } from '../mapper';

export type MapperConstructor<T = unknown> = (new (object: T) => Mapper<T>) & {
  getRelatedType(): string;
};
