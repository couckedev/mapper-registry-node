export class MultipleFunctionsError extends Error {
  constructor(type: string, direction: string) {
    const message = `Multiple mapping methods exist for type '${type}' and direction '${direction}'`;
    super(message);
  }
}
