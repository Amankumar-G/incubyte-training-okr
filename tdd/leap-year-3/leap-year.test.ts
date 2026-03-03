import { describe, expect, it } from "vitest";
import { isLeapYear } from "./leap-year";

describe("isLeapYear", () => {
    it("should return false for a year not leap year",()=>{
        expect(isLeapYear(1997)).toBe(false);
    })

    it("should return true for a year divisible by 4 ",()=>{
        expect(isLeapYear(1996)).toBe(true);
        expect(isLeapYear(2024)).toBe(true);
        expect(isLeapYear(2028)).toBe(true);
    })

    
})