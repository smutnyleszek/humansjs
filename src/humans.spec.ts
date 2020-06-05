import { Humans } from "./humans";

describe("Humans", () => {
  it("should create initial population", () => {
    const myHumans = new Humans(15);
    expect(myHumans.getTotalCount()).toBe(15);
  });

  it("should be able to return only other human with getRandomHuman", () => {
    const myHumans = new Humans(10);
    const testHuman = myHumans.getHuman(5);

    let wasEverSame = false;
    for (let i = 0; i < 1000; i++) {
      const randomHuman = myHumans.getRandomHuman();
      if (randomHuman.name === testHuman.name) {
        wasEverSame = true;
      }
    }
    expect(wasEverSame).toBeTruthy();

    wasEverSame = false;
    for (let i = 0; i < 1000; i++) {
      const randomHuman = myHumans.getRandomHuman(5);
      if (randomHuman.name === testHuman.name) {
        wasEverSame = true;
      }
    }
    expect(wasEverSame).toBeFalsy();
  });
});
