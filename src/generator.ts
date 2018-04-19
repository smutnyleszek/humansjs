class Generator {
  public getRandomNumber(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    // window.crypto is much slower than a simpler Math.random
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
  }

  public getRandomPercent(): number {
    return this.getRandomNumber(0, 100);
  }
}

export const generator = new Generator();
