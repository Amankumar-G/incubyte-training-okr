import { add } from "./add";
import { describe, it, expect } from "vitest";

describe("add", () => {
    it("should return 3 for 1 + 2 ", () => {
        expect(add(1, 2)).toBe(3);
    })
})