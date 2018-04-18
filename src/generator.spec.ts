import { generator } from "./generator";

describe("generator", () => {
  it("should return a percentage with getRandomPercent", () => {
    // check 1000 times (becouse it is random)
    for (let i = 0; i < 1000; i++) {
      const randomPercent = generator.getRandomPercent();
      // it should be a whole number
      expect(String(randomPercent).indexOf(".")).toBe(-1);
      expect(randomPercent >= 0).toBeTruthy();
      expect(randomPercent <= 100).toBeTruthy();
    }
  });
});
