// I tried using window.crypto, but it was much slower than a simpler Math.random
class Generator {
  public getRandomNumber(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
  }

  public getRandomPercent(): number {
    return this.getRandomNumber(0, 100);
  }
}

export const generator = new Generator();
