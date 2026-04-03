import {describe, it, expect} from "vitest"
import {isPalindrome} from './palindrome'

describe("isPalidrome", () => {
    
    it("should return true for empty string", () => {
        expect(isPalindrome("")).toBe(true);
    })
    
    it("should return true for single-character valid string", () => {
        expect(isPalindrome("a")).toBe(true);
        expect(isPalindrome("z")).toBe(true);
        expect(isPalindrome("b")).toBe(true);
    })
    
    it("should return true for multi-character palindrome string",()=>{
        expect(isPalindrome("aba")).toBe(true);
        expect(isPalindrome("ababa")).toBe(true);
    })

    it("should return false for multi-character non-palindrome string",()=>{
        expect(isPalindrome("abc")).toBe(false);
        expect(isPalindrome("ab")).toBe(false);
        expect(isPalindrome("hello")).toBe(false);
    })

    it("should return true for palindrome string by ingnoring case", () =>{
       expect(isPalindrome("Racecar")).toBe(true);  
       expect(isPalindrome("Aba")).toBe(true);
    })

    it('should return false for non-palindrome string by ingnoring case', () =>{
        expect(isPalindrome("Hello")).toBe(false);
        expect(isPalindrome("World")).toBe(false);
    })

})