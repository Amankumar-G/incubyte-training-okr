/*
previous naive implementation (kept for reference while changing):

export function add(inputString:string) :number {
    // handled only empty, single or two comma-separated numbers
    if (inputString.length>0) {
            const convstr:string[] = inputString.split(",")
            return parseInt(convstr[0]) + parseInt(convstr[1])
    }
    return parseInt(inputString)
}

*/

export function add(inputString: string): number {
  // imperative implementation, avoids map/reduce as requested
  if (!inputString.trim()) return 0;

  let numbersSection = inputString;
  const delimiters: string[] = [",", "\n"];

  // Custom delimiter header
  if (inputString.startsWith("//")) {
    const newlineIndex = inputString.indexOf("\n");
    const header = inputString.slice(2, newlineIndex);
    numbersSection = inputString.slice(newlineIndex + 1);

    if (header.startsWith("[") && header.endsWith("]")) {
      // multiple or long delimiters like [***][%]
      extractCustomDelimiters(header, delimiters);
    } else {
      // single char delimiter like //;\n
      delimiters.push(header);
    }
  }

  // build split regexp from delimiters (escape special regex chars)
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = delimiters.map(esc).join("|");
  const parts = numbersSection.split(new RegExp(pattern));

  let sum = 0;
  const negatives: number[] = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "") continue;
    const n = Number(p);
    if (isNaN(n)) continue;
    if (n < 0) negatives.push(n);
    else if (n <= 1000) sum += n;
  }

  if (negatives.length > 0) {
    throw new Error("negatives not allowed: " + negatives.join(" "));
  }

  return sum;
}

function extractCustomDelimiters(header: string, delimiters: string[]) {
  const re = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(header)) !== null) {
    delimiters.push(match[1]);
  }
}

export function addImperative(inputString: string): number {
  if (!inputString) return 0;

  let numbersSection = inputString;
  const delimiters: string[] = [",", "\n"];

  if (inputString.startsWith("//")) {
    const newlineIdx = inputString.indexOf("\n");
    const header = inputString.slice(2, newlineIdx);
    numbersSection = inputString.slice(newlineIdx + 1);

    if (header.startsWith("[") && header.endsWith("]")) {
      const re = /\[([^\]]+)\]/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(header)) !== null) {
        delimiters.push(m[1]);
      }
    } else {
      delimiters.push(header);
    }
  }

  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = "";
  for (let i = 0; i < delimiters.length; i++) {
    if (i) pattern += "|";
    pattern += esc(delimiters[i]);
  }

  const parts = numbersSection.split(new RegExp(pattern));

  let sum = 0;
  const negatives: number[] = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p === "") continue;
    const n = Number(p);
    if (isNaN(n)) continue;
    if (n < 0) negatives.push(n);
    else if (n <= 1000) sum += n;
  }

  if (negatives.length > 0) {
    throw new Error("negatives not allowed: " + negatives.join(" "));
  }

  return sum;
}
