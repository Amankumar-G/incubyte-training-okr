export const add = (stringInput: string): number => { 
    if(stringInput.length > 0){
        return Number(stringInput);
    }
    return 0;
}