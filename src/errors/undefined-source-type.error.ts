export class UndefinedSourceType extends Error {
  constructor() {
    const message = `Soruce type cannot be resolved`;
    super(message);
  }
}
