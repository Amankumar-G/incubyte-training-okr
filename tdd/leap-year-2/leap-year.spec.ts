import {describe, expect, it} from "vitest";
import {isLeapYear} from "./leap-year";

describe("isLeapYear",()=>{
    it("should return false for a non leap year.",()=>{
        expect(isLeapYear(2019)).toBe(false);
    })
})