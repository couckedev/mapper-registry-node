export class UndefinedToTypeError extends Error {
  constructor() {
    const message = `TO_TYPE is missing`;
    super(message);
  }
}
