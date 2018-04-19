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
});
