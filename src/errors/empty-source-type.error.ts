export class EmptySourceTypeError extends Error {
  constructor() {
    const message = `Source type cannot be empty`;
    super(message);
  }
}
