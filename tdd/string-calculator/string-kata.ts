export const add = (stringInput: string): number => { 

    if(stringInput.length > 0 && stringInput.includes(',')) {
        const numbers = stringInput.split(',');
        if(numbers.length === 2) {
             return Number(numbers[0]) + Number(numbers[1]);
        } else if(numbers.length === 3) {
            return Number(numbers[0]) + Number(numbers[1]) + Number(numbers[2]);
        } else {
              return Number(numbers[0]) + Number(numbers[1]) + Number(numbers[2]) + Number(numbers[3]);
        }
    } 
    if(stringInput.length > 0) {

        return Number(stringInput);
    }
    return 0;
}