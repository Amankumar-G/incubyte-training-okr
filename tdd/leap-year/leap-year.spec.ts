import { describe, it, expect } from 'vitest';
import { isLeapYear } from './leap-year';

describe('isLeapYear',() =>{
    it('should return false if year is not divisible by 4',() => {
        expect(isLeapYear(1997)).toBe(false);
    })

    it('should return true if year is divisible by 4',() => {
        expect(isLeapYear(1996)).toBe(true);
    })

    it('should return false if year is divisible by 100 but not by 400',() => {
        expect(isLeapYear(1800)).toBe(false);
    })

})