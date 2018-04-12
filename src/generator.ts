class Generator {
  public getRandomNumber(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);

    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(randomNumber * (maxFloor - minCeil + 1)) + minCeil;
  }
}

export const generator = new Generator();
