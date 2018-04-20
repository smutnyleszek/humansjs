import { Human } from "./Human";

describe("Human", () => {
  it("should increase age by 1 with bumpAge", () => {
    const person = new Human();
    const personAgeBefore = person.age;
    person.bumpAge();
    expect(person.age - personAgeBefore).toBe(1);
  });

  it("should be alive as long as did not reach lifespan", () => {
    const person = new Human();
    person.lifespan = 5;
    person.age = 3;
    person.bumpAge(); // 4
    expect(person.isAlive).toBeTruthy();
    person.bumpAge(); // 5
    expect(person.isAlive).toBeFalsy();
    person.bumpAge(); // 6
    expect(person.isAlive).toBeFalsy();
  });

  it("should become adult when reaching puberty age", () => {
    const person = new Human();
    person.age = Human.pubertyAge - 2;
    person.bumpAge();
    expect(person.ageGroup).toBe(Human.ageGroups.Baby);
    person.bumpAge();
    expect(person.ageGroup).toBe(Human.ageGroups.Adult);
  });

  it("should become elder when reaching menopause age", () => {
    const person = new Human();
    person.age = Human.menopauseAge - 2;
    person.bumpAge();
    expect(person.ageGroup).toBe(Human.ageGroups.Adult);
    person.bumpAge();
    expect(person.ageGroup).toBe(Human.ageGroups.Elder);
  });

  it("should be influenced by parents vitalitys", () => {
    const godlyParent = new Human();
    godlyParent.vitality = 100;

    const poorParent = new Human();
    poorParent.vitality = 1;

    for (let i = 0; i < 1000; i++) {
      const regular = new Human();
      expect(regular.vitality >= 27 && regular.vitality <= 67).toBeTruthy();

      const demigod = new Human(godlyParent, godlyParent);
      expect(demigod.vitality >= 54 && demigod.vitality <= 94).toBeTruthy();

      const poor = new Human(poorParent, poorParent);
      expect(poor.vitality >= 4 && poor.vitality <= 44).toBeTruthy();
    }
  });
});
