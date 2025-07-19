import { UndefinedFromTypeError } from '../errors';
import { FROM_TYPE_TOKEN } from '../tokens/from-type.token';

export function MapsFrom(fromType: string) {
  if (fromType.length < 1) {
    throw new UndefinedFromTypeError();
  }
  return (target: object) => {
    Reflect.defineMetadata(FROM_TYPE_TOKEN, fromType, target);
  };
}
