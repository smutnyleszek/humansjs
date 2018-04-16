class Logger {
  public constructor(private autoScroll: boolean) {}

  public log(message: string): void {
    document.body.appendChild(document.createTextNode(`${message}\n`));

    if (
      this.autoScroll &&
      // enable autoscroll only if scrolled to almost end of page
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 30
    ) {
      document.body.scrollIntoView({
        behavior: "instant",
        // browser is aligning to the bottom of element
        block: "end",
        inline: "nearest"
      });
    }
  }
}

export const logger = new Logger(true);
