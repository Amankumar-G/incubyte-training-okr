export function isLeapYear(year: number): boolean {
    if(year % 4 === 0) {
        return true;
    }
    return false;
}