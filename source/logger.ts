import { simulationYearTime } from "./common";
import { IncidentName, listen } from "./incidents";

class Logger {
  public output: HTMLElement | null = null;
  private scrollingTimeoutId: number = 0;
  private rowHeight: number = 0;
  // flag to make sure it scrolls to end at the beginnig (bug on small screens)
  private isFirstTime: boolean = true;
  private readonly isPlayingClassName: string = "is-playing";
  private readonly isScrollingClassName: string = "is-scrolling";

  public constructor() {
    listen(IncidentName.GameStart, this.onGameStart.bind(this));
    listen(IncidentName.GameOver, this.onGameOver.bind(this));
  }

  // adds given message to the body in new line
  public log(message: string, withScroll: boolean = true): void {
    this.verifyOutput();
    if (this.output) {
      // insertAdjacentHTML plus appendChild is fastest:
      // https://jsperf.com/insertadjacenthtml-perf/28
      const row = window.document.createElement("li");
      row.insertAdjacentHTML("beforeend", message);
      this.output.appendChild(row);
      if (withScroll) {
        this.rowHeight = row.offsetHeight;
        this.scrollToEnd();
      }
    }
  }

  private scrollToEnd(): void {
    if (
      this.output &&
      this.output.scrollIntoView &&
      // autoscroll if scrolled to almost end of page
      (this.isNearEnd() || this.isFirstTime)
    ) {
      this.isFirstTime = false;
      this.output.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
      this.onScroll();
    }
  }

  private isNearEnd(): boolean {
    return (
      window.document.body.offsetHeight -
        (window.pageYOffset + window.innerHeight) <=
      this.rowHeight * 2
    );
  }

  private verifyOutput(): void {
    if (!this.output) {
      this.output = document.getElementById("log");
    }
  }

  private onGameStart(): void {
    window.document.body.classList.add(this.isPlayingClassName);
  }

  private onGameOver(): void {
    window.document.body.classList.remove(this.isPlayingClassName);
  }

  private onScroll(): void {
    window.document.body.classList.add(this.isScrollingClassName);
    window.clearTimeout(this.scrollingTimeoutId);
    this.scrollingTimeoutId = window.setTimeout(
      this.onAfterScroll.bind(this),
      simulationYearTime * 2
    );
  }

  private onAfterScroll(): void {
    window.document.body.classList.remove(this.isScrollingClassName);
  }
}

export const logger = new Logger();
