const alpha = require("./alpha")
const beta = require("./beta")

test("coverage test alpha", () => {
  expect(alpha(5, "-")).toBe(-5)
})

test("coverage test beta", () => {
  expect(beta(5, "-")).toBe(-5)
})

