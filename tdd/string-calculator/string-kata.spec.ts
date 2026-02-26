import {describe, it, expect} from 'vitest';
import { add } from './string-kata';

describe('StringCalculator', () => {
    it('should return 0 for an empty string', () => {
        expect(add('')).toBe(0);
    });

    it('should return the number for a single number string', () => {
        expect(add('5')).toBe(5);
        expect(add('10')).toBe(10);
        expect(add('15')).toBe(15);
    });

    it('should return the sum of two numbers in a string', () => {
        expect(add('1,2')).toBe(3);
    })

    it('should return the sum of arbitrary numbers in a string', () => {
        expect(add('1,2,3')).toBe(6);
        expect(add('1,2,3,4')).toBe(10);
    })

    it('should return the sum of arbitrary numbers in a string including new line saprator', () => {
        expect(add('1,2\n3')).toBe(6);
    })

    it('should return the sum of arbitrary numbers in a string including custom saprator', () => {
        expect(add('//;\n1;2')).toBe(3);
    })
})