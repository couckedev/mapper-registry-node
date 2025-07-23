export class MapperAlreadyExistsError extends Error {
  constructor(
    public readonly from: string,
    public readonly to: string
  ) {
    const message = `Mapper for ${from}->${to} mapping already exists`;
    super(message);
  }
}
