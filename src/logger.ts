class Logger {
  private static readonly safetyOffset: number = 100;
  public constructor(private autoScroll: boolean) {}

  public log(message: string): void {
    // insertAdjacentHTML seems to be a bit faster than appendChild
    document.body.insertAdjacentHTML("beforeend", `${message}\n`);

    if (
      document.body.scrollIntoView &&
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
