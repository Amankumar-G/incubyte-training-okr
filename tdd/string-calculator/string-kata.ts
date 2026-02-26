export const add = (stringInput: string): number => { 

    if(stringInput.trim() === "") {
        return 0;
    }

    const customSeparatorMatch = stringInput.match(/^\/\/(.+)\n/);

    if (customSeparatorMatch) {
        const customSeparator = customSeparatorMatch[1];
        stringInput = stringInput.replace(`//${customSeparator}\n`, '');
        stringInput = stringInput.split(customSeparator).join(',');
    }

    const stringArray = stringInput.split(/[\n,]+/);

    const numberArray = stringArray.map(Number);

    return numberArray.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
    
}