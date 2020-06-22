import { logger } from "./logger";

describe("logger", () => {
  beforeEach(() => {
    const logEl = document.createElement("ul");
    logEl.setAttribute("id", "log");
    document.body.appendChild(logEl);
  });

  it("should add text to body with log", () => {
    logger.log("qwerty");
    const logEl = document.getElementById("log");
    expect(logEl).not.toBe(null);
    if (logEl !== null) {
      expect(logEl.children[0].textContent).toBe("qwerty");
    }
  });
});
