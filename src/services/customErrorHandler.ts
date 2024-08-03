class customErrorHandler extends Error {
  statusCode: number;
  message: string;
  constructor(status: number, msg: string) {
    super();
    this.statusCode = status;
    this.message = msg;
  }

  static alreadyExist(message: string) {
    return new customErrorHandler(409, message);
  }

  static wrongCredentials(message: string = "Email or Password is wrong!") {
    return new customErrorHandler(401, message);
  }

  static unAuthorized(message: string = "unAuthorized User") {
    return new customErrorHandler(401, message);
  }

  static notFound(message: string = "404 Not Found") {
    return new customErrorHandler(404, message);
  }

  static serverError(message: string = "Internal Server Error") {
    return new customErrorHandler(500, message);
  }
}

export default customErrorHandler;
