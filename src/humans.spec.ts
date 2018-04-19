import { Humans } from "./humans";

describe("Humans", () => {
  it("should create initial population", () => {
    const myHumans = new Humans(15);
    expect(myHumans.getTotalCount()).toBe(15);
  });
});
