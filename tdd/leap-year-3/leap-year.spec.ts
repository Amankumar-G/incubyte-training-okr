import { describe, expect, it } from "vitest";
import { isLeapYear } from "./leap-year";

describe("isLeapYear", () => {
    it("should return false for a year not leap year",()=>{
        expect(isLeapYear(1997)).toBe(false);
    })
})