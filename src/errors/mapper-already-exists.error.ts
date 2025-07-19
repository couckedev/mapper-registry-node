export class MapperAlreadyExistsError extends Error {
  constructor(public readonly type: string) {
    const message = `Mapper for type ${type} already exists`;
    super(message);
  }
}
