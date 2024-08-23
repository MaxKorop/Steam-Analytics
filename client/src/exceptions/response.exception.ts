class ResponseError extends Error {
  public error: string;
  public statusCode: number;

  constructor(error: string, message: string, statusCode: number) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}

export { ResponseError };