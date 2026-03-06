import {fizzBuzz} from "./fizz-buzz";
import {describe, expect, it} from "vitest";

describe("fizzBuzz", () => {
    it("should return '' when input is neither divisible by 3 nor 5", () => {
        expect(fizzBuzz(1)).toBe("");
    })

    it.each([3, 6, 9])("should return 'Fizz' when input is %i", (input) => {
        expect(fizzBuzz(input)).toBe("Fizz");
    })

    it.each([5, 10, 20])("should return 'Buzz' when input is %i", (input) => {
        expect(fizzBuzz(input)).toBe("Buzz");
    })

    it.each([15,30,45])("should return 'FizzBuzz' when the input is %i", (input) => {
        expect(fizzBuzz(input)).toBe("FizzBuzz");
    })

    it('should throw an error when input is negative', () => {
        expect(() => fizzBuzz(-1)).toThrow("Input must be a non-negative integer");
    })
})