import {describe, expect, it} from "vitest";
import {isLeapYear} from "./leap-year";

describe("isLeapYear",()=>{
    it("should return false for a non leap year.",()=>{
        expect(isLeapYear(2019)).toBe(false);
    })
    it("should return true for a year divisible by 4",()=>{
        expect(isLeapYear(2020)).toBe(true);
    })
    it("should return false for a year divisible by 100 .",()=>{
        expect(isLeapYear(1900)).toBe(false);
    })
    it("should return true for a year divisible by 400 .",()=>{
        expect(isLeapYear(2000)).toBe(true);
    })

})