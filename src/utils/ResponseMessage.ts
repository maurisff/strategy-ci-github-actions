
export default class ResponseMessage {
  public readonly code: string;
  public readonly message: string;
  public readonly detail: string;

  constructor (code: string, message: string, detail: string = undefined) {
    this.code = code
    this.message = message
    if (detail) {
      this.detail = detail
    }
  }
}
