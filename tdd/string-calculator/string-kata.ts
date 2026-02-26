export const add = (stringInput: string): number => { 

    if(stringInput.trim() === "") {
        return 0;
    }

    const stringArray = stringInput.split(/[\n,]+/);

    const numberArray = stringArray.map(Number);

    return numberArray.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
    
}