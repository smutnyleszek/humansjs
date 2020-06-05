class Generator {
  public getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getRandomPercent(): number {
    return this.getRandomNumber(0, 100);
  }

  // returns capitalized two part name, e.g. "N03murxt48 Ka9dpari"
  public getUniqueName(): string {
    const firstName = Math.random().toString(36).substring(2);
    const lastName = Date.now().toString(36);
    return `${firstName} ${lastName}`.replace(/\b\w/g, (c: string) =>
      c.toUpperCase()
    );
  }
}

export const generator = new Generator();
