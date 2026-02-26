import {describe, it, expect} from 'vitest';
import { add } from './string-kata';

describe('StringCalculator', () => {
    it('should return 0 for an empty string', () => {
        expect(add('')).toBe(0);
    });
})