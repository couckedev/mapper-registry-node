export class FunctionNotFoundError extends Error {
  constructor(
    public readonly relatedType: string,
    public readonly targetType: string
  ) {
    const message = `Method for mapping ${relatedType}->${targetType} has not been found`;
    super(message);
  }
}
