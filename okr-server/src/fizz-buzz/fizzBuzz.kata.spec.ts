import { fizzBuzz } from './fizzBuzz.kata';

describe('FizzBuzz', () => {
  it('should return an empty string when the input value is neither divided by 3 nor 5', () => {
    const result = fizzBuzz(1);
    expect(result).toBe('');
  });

  it('should return Fizz when the input value is divisible by only 3', () => {
    const result = fizzBuzz(3);
    expect(result).toBe('Fizz');
  });

  it('should return Buzz when the input value is divisible by only 5', () => {
    const result = fizzBuzz(5);
    expect(result).toBe('Buzz');
  });

  it('should return FizzBuzz when the input value is divisible by both 3 and 5', () => {
    const result = fizzBuzz(15);
    expect(result).toBe('FizzBuzz');
  });
});
