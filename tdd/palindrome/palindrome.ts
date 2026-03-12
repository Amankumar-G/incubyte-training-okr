export const isPalindrome = (str:string)=>{
    
    const lowerCaseStr = str.toLowerCase();

    const reversedStr = lowerCaseStr.split("").reverse().join("");
    
    return lowerCaseStr === reversedStr; 
    // if(str === "")  return true;
    // if(str.length === 1) return true;
    
    // if(str === 'a') return true;
    // if(str === 'z') return true;
    
    // if(str === 'aba') return true;
    // if(str === 'ababa') return true;
    
    // if(str === "Racecar") return true;
    // if(str === "Aba") return true;
}