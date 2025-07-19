export class MethodNotFoundError extends Error {
  constructor(
    public readonly sourceType: string,
    public readonly targetType: string
  ) {
    const message = `Method for mapping ${sourceType}->${targetType} has not been found`;
    super(message);
  }
}
