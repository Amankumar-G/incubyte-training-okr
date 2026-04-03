const divisibleBy3 = (num: number): boolean => num % 3 === 0;

const divisibleBy5 = (num: number): boolean => num % 5 === 0;

export const fizzBuzz = (num: number): string => {
    if (num < 0) {
        throw new Error("Input must be a non-negative integer");
    }

    if(divisibleBy3(num) && divisibleBy5(num)) {
        return "FizzBuzz";
    }
    if(divisibleBy5(num)) {
        return "Buzz";
    }
    if (divisibleBy3(num)) {
        return "Fizz";
    }
    return "";
}

