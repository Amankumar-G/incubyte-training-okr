import { isLeapYear } from './leapYear.kata';

describe('IsLeapYear', () => {
  it('should return false when year is not divisible by 4', () => {
    const result = isLeapYear(2023);
    expect(result).toBe(false);
  });

  it('should return true when year is divisible by 4 but not by 100', () => {
    const result = isLeapYear(2024);
    expect(result).toBe(true);
  });

  it('should return false when year is divisible by 4 and 100 but not by 400', () => {
    const result = isLeapYear(1700);
    expect(result).toBe(false);
  });

  it('should return true when year is divisible by 400', () => {
    const result = isLeapYear(1600);
    expect(result).toBe(true);
  });
});
