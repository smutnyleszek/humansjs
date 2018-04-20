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
}

export const generator = new Generator();
