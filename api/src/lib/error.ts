export default class ErrorWithCode extends Error {
  code: string

  /**
   * Error class with .code property
   * @param msg Error message
   * @param code Code to assign to the error, accesible on err.code
   */
  constructor(msg?: string, code?: string) {
    super(msg)
    if (code) this.code = code
  }
}
