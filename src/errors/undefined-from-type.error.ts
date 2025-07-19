export class UndefinedFromTypeError extends Error {
  constructor(methodName: string) {
    const message = `'FROM_TYPE' metadata is missing for mapping method ${methodName}`;
    super(message);
  }
}
