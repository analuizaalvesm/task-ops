import {
  generateId,
  delay,
  deepClone,
  safeJsonParse,
  isEmpty,
} from "../../../utils/helpers";

describe("Helpers", () => {
  describe("generateId", () => {
    it("should generate a unique ID", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it("should generate UUID format", () => {
      const id = generateId();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidRegex);
    });
  });

  describe("delay", () => {
    it("should delay execution", async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      const elapsed = end - start;
      expect(elapsed).toBeGreaterThanOrEqual(95); // Allow small margin
    });
  });

  describe("deepClone", () => {
    it("should deep clone an object", () => {
      const original = { name: "John", address: { city: "NYC" } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.address).not.toBe(original.address);
    });

    it("should clone arrays", () => {
      const original = [1, 2, { value: 3 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it("should handle nested structures", () => {
      const original = {
        users: [{ name: "John", roles: ["admin"] }],
        config: { enabled: true },
      };
      const cloned = deepClone(original);

      cloned.users[0].name = "Jane";
      expect(original.users[0].name).toBe("John");
    });
  });

  describe("safeJsonParse", () => {
    it("should parse valid JSON", () => {
      const json = '{"name":"John","age":30}';
      const result = safeJsonParse(json);
      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should return null for invalid JSON", () => {
      const invalidJson = "{name: John}";
      const result = safeJsonParse(invalidJson);
      expect(result).toBeNull();
    });

    it("should handle empty string", () => {
      const result = safeJsonParse("");
      expect(result).toBeNull();
    });

    it("should parse arrays", () => {
      const json = "[1, 2, 3]";
      const result = safeJsonParse(json);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("isEmpty", () => {
    it("should return true for null", () => {
      expect(isEmpty(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return true for empty array", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return false for non-empty array", () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it("should return true for empty object", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("should return false for non-empty object", () => {
      expect(isEmpty({ name: "John" })).toBe(false);
    });

    it("should return false for non-empty string", () => {
      expect(isEmpty("hello")).toBe(false);
    });

    it("should return false for number", () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(42)).toBe(false);
    });
  });
});
