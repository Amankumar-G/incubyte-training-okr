export function isPalindrome(text: string) {
  const textArray = text
    .toLowerCase()
    .split('')
    .filter((x) => x !== ' ');

  const filteredText = textArray.join('');
  const reverseText = textArray.reverse().join('');

  return reverseText === filteredText;
}
