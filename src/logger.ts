class Logger {
  private static readonly safetyOffset: number = 30;
  public constructor(private autoScroll: boolean) {}

  public log(message: string): void {
    document.body.appendChild(document.createTextNode(`${message}\n`));

    if (
      this.autoScroll &&
      // enable autoscroll only if scrolled to almost end of page
      window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - Logger.safetyOffset
    ) {
      // false means to the bottom of the element
      document.body.scrollIntoView(false);
    }
  }
}

export const logger = new Logger(true);
