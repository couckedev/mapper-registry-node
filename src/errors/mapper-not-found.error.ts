export class MapperNotFoundError extends Error {
  constructor(
    public readonly from: string,
    public readonly to: string
  ) {
    const message = `Mapper for ${from}->${to} mapping has not been found`;
    super(message);
  }
}
