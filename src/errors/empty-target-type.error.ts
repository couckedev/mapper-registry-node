export class EmptyTargetTypeError extends Error {
  constructor() {
    const message = `Source type cannot be empty`;
    super(message);
  }
}
