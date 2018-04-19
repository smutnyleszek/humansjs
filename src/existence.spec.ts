import { Existence } from "./existence";

describe("Existence", () => {
  it("should create initial population", () => {
    const humanExistence = new Existence();
    expect(document.body.textContent).toBe("4129 humans appeared.\n");
  });
});
