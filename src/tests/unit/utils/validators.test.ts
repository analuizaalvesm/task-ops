import {
  isValidEmail,
  isNotEmpty,
  isFutureDate,
  hasMinLength,
  hasRequiredFields,
} from "../../../utils/validators";

describe("Validators", () => {
  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    it("should return true for non-empty strings", () => {
      expect(isNotEmpty("Hello")).toBe(true);
      expect(isNotEmpty("  test  ")).toBe(true);
    });

    it("should return false for empty or whitespace strings", () => {
      expect(isNotEmpty("")).toBe(false);
      expect(isNotEmpty("   ")).toBe(false);
    });
  });

  describe("isFutureDate", () => {
    it("should return true for future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isFutureDate(futureDate)).toBe(true);
    });

    it("should return false for past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isFutureDate(pastDate)).toBe(false);
    });
  });

  describe("hasMinLength", () => {
    it("should validate minimum length correctly", () => {
      expect(hasMinLength("hello", 3)).toBe(true);
      expect(hasMinLength("hello", 5)).toBe(true);
      expect(hasMinLength("hi", 5)).toBe(false);
    });
  });

  describe("hasRequiredFields", () => {
    it("should return true when all required fields are present", () => {
      const obj = { name: "John", email: "john@example.com", age: 30 };
      expect(hasRequiredFields(obj, ["name", "email"])).toBe(true);
    });

    it("should return false when required fields are missing", () => {
      const obj: { name: string; email: string; age?: number } = {
        name: "John",
        email: "",
      };
      expect(hasRequiredFields(obj, ["name", "email", "age"])).toBe(false);
    });
  });
});
