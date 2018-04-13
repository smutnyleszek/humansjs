class Logger {
  public constructor(private autoScroll: boolean) {
    document.body.style.whiteSpace = "pre";
    document.body.style.fontFamily = "monospace";
  }

  public log(message: string): void {
    document.body.appendChild(document.createTextNode(`${message}\n`));

    if (this.autoScroll) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant"
      });
    }
  }
}

export const logger = new Logger(true);
