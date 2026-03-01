export class DataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataError";
  }
}

export class DataUnavailableError extends DataError {}
export class AuthError extends DataError {}
export class TimeoutError extends DataError {}
export class DataFormatError extends DataError {}
