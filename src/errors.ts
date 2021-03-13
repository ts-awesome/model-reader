
export class ReaderError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReaderError.prototype);
  }
}
