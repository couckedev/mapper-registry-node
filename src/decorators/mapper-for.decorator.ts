import { SOURCE_TYPE_TOKEN } from '../tokens/source-type.token';

export function MapperFor(sourceType: string) {
  return (target: object) => {
    Reflect.defineMetadata(SOURCE_TYPE_TOKEN, sourceType, target);
  };
}
