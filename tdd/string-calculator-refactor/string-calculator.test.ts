import { describe, it, expect } from "vitest";
import { add, addImperative } from "./string-calculator";

describe("StringCalculator", () => {
  it("should return 0 for empty string", () => {
    expect(add("")).toBe(0);
    expect(add(" ")).toBe(0);
  });

  it.each([
    { input: "5", expected: 5 },
    { input: "10", expected: 10 },
    { input: "15", expected: 15 },
  ])(
    "should return the number itself when input is single input string: %s",
    ({ input, expected }) => {
      expect(add(input)).toBe(expected);
    },
  );

  it.each([
    { input: "3,5", expected: 8 },
    { input: "10,20", expected: 30 },
  ])(
    'should return the sum of two numbers for "," separated input string: %s',
    ({ input, expected }) => {
      expect(add(input)).toBe(expected);
    },
  );

  it.each([
    { input: "//;\n1;2", expected: 3 },
    { input: "//%\n1%2", expected: 3 },
  ])(
    "should return the sum of numbers for an input string with a single character custom delimiter: %s",
    ({ input, expected }) => {
      expect(add(input)).toBe(expected);
    },
  );

  it.each([
    { input: "2,1001", expected: 2 },
    { input: "1001,2,1003,4", expected: 6 },
    { input: "1000,2", expected: 1002 },
  ])(
    "should return the sum of numbers for an input string by ignoring the numbers > 1000: %s",
    ({ input, expected }) => {
      expect(add(input)).toBe(expected);
    },
  );

  it.each([
    { input: "//[***]\n1***2***3", expected: 6 },
    { input: "//[*][%]\n1*2%3", expected: 6 },
    { input: "//[foo][bar]\n1foo2bar3", expected: 6 },
  ])(
    "should return the sum of numbers for an input string with custom delimiters of any length and multiple delimiters: %s",
    ({ input, expected }) => {
      expect(add(input)).toBe(expected);
    },
  );

  it("should throw an error listing all negative numbers for an input string that has any negatives", () => {
    expect(() => add("1,-2,-3")).toThrowError(/negatives not allowed: -2 -3/);
    expect(() => addImperative("1,-2,-3")).toThrowError(
      /negatives not allowed: -2 -3/,
    );
  });
});
