class Logger {
  private static readonly safetyOffset: number = 100;
  public output: HTMLElement | null = null;

  // adds given message to the body, ending with newline
  public log(message: string): void {
    this.verifyOutput();
    if (this.output) {
      // insertAdjacentHTML seems to be a bit faster than appendChild
      this.output.insertAdjacentHTML("beforeend", `${message}\n`);
      this.scrollToEnd();
    }
  }

  private scrollToEnd(): void {
    if (
      this.output &&
      this.output.scrollIntoView &&
      // autoscroll if scrolled to almost end of page
      window.innerHeight + window.pageYOffset >=
        this.output.offsetHeight - Logger.safetyOffset
    ) {
      // false means to the bottom of the element
      this.output.scrollIntoView(false);
    }
  }

  private verifyOutput(): void {
    if (!this.output) {
      this.output = document.getElementById("log");
    }
  }
}

export const logger = new Logger();
