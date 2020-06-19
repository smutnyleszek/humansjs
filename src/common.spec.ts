import { CatastropheName, getCatastrophe } from "./common";

describe("common", () => {
  it("should be able to return a catastrophe", () => {
    const targetCatastrophe = getCatastrophe(CatastropheName.War);
    expect(targetCatastrophe).not.toBe(null);
    if (targetCatastrophe !== null) {
      expect(targetCatastrophe.name).toBe(CatastropheName.War);
    }
  });
});
