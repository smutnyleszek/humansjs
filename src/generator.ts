class Generator {
  private lookup: number[] = [];
  private lookupIndex: number = 0;

  public constructor() {
    for (let i = 1e6; i >= 0; i--) {
      this.lookup.push(Math.round(Math.random() * 100));
    }
  }

  public getRandomNumber(min: number, max: number): number {
    this.lookupIndex++;
    if (this.lookupIndex >= this.lookup.length) {
      this.lookupIndex = 0;
    }
    const randomNumber = this.lookup[this.lookupIndex];
    return Math.floor(randomNumber / 100 * (max - min)) + min;
  }

  public getRandomPercent(): number {
    return this.getRandomNumber(0, 100);
  }

  // returns capitalized two part name, e.g. "N03murxt48 Ka9dpari"
  public getUniqueName(): string {
    const firstName = Math.random().toString(36).substring(2);
    const lastName = Date.now().toString(36);
    return (`${firstName} ${lastName}`).replace(/\b\w/g, (c: string) => c.toUpperCase());
  }
}

export const generator = new Generator();
