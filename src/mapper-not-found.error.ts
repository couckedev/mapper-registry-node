export class MapperNotFoundError extends Error {
  constructor(public readonly type: string) {
    const message = `Mapper for type ${type} has not been found`;
    super(message);
  }
}
