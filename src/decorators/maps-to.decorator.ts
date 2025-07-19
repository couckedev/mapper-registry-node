import { TO_TYPE_TOKEN } from '../tokens/to-type.token';

export function MapsTo(toType: string) {
  return (target: object) => {
    Reflect.defineMetadata(TO_TYPE_TOKEN, toType, target);
  };
}
