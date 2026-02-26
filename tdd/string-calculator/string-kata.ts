export const add = (stringInput: string): number => { 

    if(stringInput.trim() === "") {
        return 0;
    }
    
    const stringArray = stringInput.split(',');

    return stringArray.reduce((acc, curr) => {
        return acc + parseInt(curr);
    }, 0);
    
}