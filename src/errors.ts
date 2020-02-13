
export class ReaderError extends Error {
  constructor(message) {
    super(message);

    Object.setPrototypeOf(this, ReaderError.prototype);
  }
}
