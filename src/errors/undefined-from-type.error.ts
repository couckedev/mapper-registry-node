export class UndefinedFromTypeError extends Error {
  constructor() {
    const message = `FROM_TYPE is missing`;
    super(message);
  }
}
