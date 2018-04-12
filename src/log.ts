export class Log {
  private static readonly logElId = "humansjslog";
  private logEl: HTMLElement = document.createElement("pre");

  public log(message: string): void {
    if (this.verifyEl()) {
      this.logEl.innerText += `\n${message}`;
    }
  }

  private verifyEl(): boolean {
    if (document.getElementById(Log.logElId)) {
      return true;
    } else {
      this.logEl.id = Log.logElId;
      document.body.appendChild(this.logEl);
      return true;
    }
  }
}
