class Logger {
  private static readonly loggerId = "logger";
  private loggerEl: HTMLElement = document.createElement("pre");

  public log(data: any): void {
    let message = data;
    if (typeof data !== "string") {
      message = JSON.stringify(data);
    }

    if (this.verifyEl()) {
      this.loggerEl.innerText += `\n${message}`;
    }
  }

  private verifyEl(): boolean {
    if (document.getElementById(Logger.loggerId)) {
      return true;
    } else {
      this.loggerEl.id = Logger.loggerId;
      document.body.appendChild(this.loggerEl);
      return true;
    }
  }
}

export const logger = new Logger();
