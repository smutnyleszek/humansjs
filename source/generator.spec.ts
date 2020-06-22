import { generator } from "./generator";

describe("generator", () => {
  it("should return random number evenly", () => {
    const test = [0, 0, 0];

    for (let i = 0; i < 10000; i++) {
      const randomNumber = generator.getRandomNumber(0, 2);
      test[randomNumber] = test[randomNumber] + 1;
    }

    expect(test[0] > 3133 && test[0] < 3533).toBeTruthy();
    expect(test[1] > 3133 && test[0] < 3533).toBeTruthy();
    expect(test[2] > 3133 && test[0] < 3533).toBeTruthy();
  });

  it("should return a percentage with getRandomPercent", () => {
    for (let i = 0; i < 1000; i++) {
      const randomPercent = generator.getRandomPercent();
      // it should be a whole number
      expect(String(randomPercent).indexOf(".")).toBe(-1);
      expect(randomPercent >= 0).toBeTruthy();
      expect(randomPercent <= 100).toBeTruthy();
    }
  });
});
