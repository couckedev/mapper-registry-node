import { UndefinedRelatedType } from '../errors';
import { RELATED_TYPE_TOKEN } from '../tokens/related-type.token';

export function MapperFor(relatedType: string) {
  if (relatedType.length < 1) {
    throw new UndefinedRelatedType();
  }
  return (target: object) => {
    Reflect.defineMetadata(RELATED_TYPE_TOKEN, relatedType, target);
  };
}
