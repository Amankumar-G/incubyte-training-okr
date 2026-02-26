export const add = (stringInput: string): number => { 
    
    if(stringInput.trim() === "") {
        return 0;
    }

    const customSeparatorMatch = stringInput.match(/^\/\/(.+)\n/);

    if (customSeparatorMatch) {
        console.log('Custom separator found:', customSeparatorMatch[1]);
        const customSeparator = customSeparatorMatch[1];
        if (customSeparator.startsWith('[') && customSeparator.endsWith(']')) {
            const separators = customSeparator.slice(1, -1).split('][');
            console.log('Multiple custom separators found:', separators);
            separators.forEach(separator => {
                stringInput = stringInput.replace(`//[${separator}]\n`, '');
                stringInput = stringInput.split(separator).join(',');
            });
        } else {
            stringInput = stringInput.replace(`//${customSeparator}\n`, '');
            stringInput = stringInput.split(customSeparator).join(',');
        }        
    }

    const stringArray = stringInput.split(/[\n,]+/);
    
    const numberArray = stringArray.map(Number);

    const negativeNumbers = numberArray.filter(num => num < 0);

    if (negativeNumbers.length > 0) {
        throw new Error(`Negative numbers are not allowed: ${negativeNumbers.join(', ')}`);
    }
    return numberArray.reduce((acc, curr) => {
        if (curr > 1000) {
            return acc;
        }
        return acc + curr;
    }, 0);
    
}