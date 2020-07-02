class Logger {
  private static readonly safetyOffset: number = 100; // px
  public output: HTMLElement | null = null;

  // adds given message to the body in new line
  public log(message: string): void {
    this.verifyOutput();
    if (this.output) {
      // insertAdjacentHTML plus appendChild is fastest:
      // https://jsperf.com/insertadjacenthtml-perf/28
      const row = window.document.createElement("li");
      row.insertAdjacentHTML("beforeend", message);
      this.output.appendChild(row);
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
      this.output.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }

  private verifyOutput(): void {
    if (!this.output) {
      this.output = document.getElementById("log");
    }
  }
}

export const logger = new Logger();
