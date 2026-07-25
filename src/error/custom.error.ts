export interface ErrorDetails {
  code: string;
  message: string;
  defaultHttpStatusCode: number;
}

export class CustomError extends Error {
  public code: string;
  public defaultHttpStatusCode: number;

  constructor(error: ErrorDetails) {
    super(error.message);
    this.code = error.code;
    this.defaultHttpStatusCode = error.defaultHttpStatusCode;
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
