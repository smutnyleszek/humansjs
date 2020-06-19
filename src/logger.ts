import { MAX_CHARS } from "./common";

class Logger {
  private static readonly safetyOffset: number = 100; // px
  public output: HTMLElement | null = null;

  // adds given message to the body in new line
  public log(message: string): void {
    this.verifyOutput();
    if (this.output) {
      const row = window.document.createElement("li");
      // insertAdjacentHTML seems to be a bit faster than appendChild
      row.innerHTML = message;
      if (row.innerText.length > MAX_CHARS) {
        console.warn(`Logging overflowing message: "${message}"!`);
      }
      this.output.insertAdjacentElement("beforeend", row);
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
