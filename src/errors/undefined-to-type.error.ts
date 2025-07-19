export class UndefinedToTypeError extends Error {
  constructor(methodName: string) {
    const message = `'TO_TYPE' metadata is missing for mapping method ${methodName}`;
    super(message);
  }
}
