import { logger } from "./logger";

describe("logger", () => {
  it("should add text to body with log", () => {
    logger.log("qwerty");
    expect(document.body.textContent).toBe("qwerty\n");
  });
});
