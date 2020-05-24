class Logger {
  private static readonly safetyOffset: number = 100;
  public constructor(private autoScroll: boolean) {}

  // adds given message to the body, ending with newline
  public log(message: string): void {
    const logEl = document.getElementById("log");
    if (logEl !== null) {
      // insertAdjacentHTML seems to be a bit faster than appendChild
      logEl.insertAdjacentHTML("beforeend", `${message}\n`);

      if (
        logEl.scrollIntoView &&
        this.autoScroll &&
        // enable autoscroll only if scrolled to almost end of page
        window.innerHeight + window.pageYOffset >=
          logEl.offsetHeight - Logger.safetyOffset
      ) {
        // false means to the bottom of the element
        logEl.scrollIntoView(false);
      }
    }
  }
}

export const logger = new Logger(true);
