import { FROM_TYPE_TOKEN } from '../tokens/from-type.token';

export function MapsFrom(fromType: string) {
  return (target: object) => {
    Reflect.defineMetadata(FROM_TYPE_TOKEN, fromType, target);
  };
}
