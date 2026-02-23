import { describe, it, expect } from 'vitest';
import { isLeapYear } from './leap-year';

describe('isLeapYear',() =>{
    it('should return false if year is not divisible by 4',() => {
        expect(isLeapYear(1997)).toBe(false);
    })
})