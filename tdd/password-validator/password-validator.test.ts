import { describe, expect, it } from "vitest";
import { validatePassword } from "./password-validator";

describe("PasswordValidator", () => {

    it("should return false for empty password", () => {
        expect(validatePassword("")).toBe(false);
    });

    it("should return false for single character password", () => {
        expect(validatePassword("a")).toBe(false);
    });

    it("should return true for password with 8 characters", () => {
        expect(validatePassword("abcdefgh")).toBe(true);
    });
});