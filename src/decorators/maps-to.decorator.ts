import { UndefinedToTypeError } from '../errors';
import { TO_TYPE_TOKEN } from '../tokens/to-type.token';

export function MapsTo(toType: string) {
  if (toType.length < 1) {
    throw new UndefinedToTypeError();
  }
  return (target: object) => {
    Reflect.defineMetadata(TO_TYPE_TOKEN, toType, target);
  };
}
