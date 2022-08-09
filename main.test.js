const thing = require("./thing")

test("coverage test", () => {
  expect(thing(5, "-")).toBe(-5)
})
