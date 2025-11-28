import {
  formatDate,
  formatDateReadable,
  capitalizeFirstLetter,
  formatPercentage,
  truncateString,
  objectToQueryString,
} from "../../../utils/formatters";

describe("Formatters", () => {
  describe("formatDate", () => {
    it("should format date to ISO string", () => {
      const date = new Date("2025-11-28T10:00:00.000Z");
      const result = formatDate(date);
      expect(result).toBe("2025-11-28T10:00:00.000Z");
    });
  });

  describe("formatDateReadable", () => {
    it("should format date to readable string", () => {
      const date = new Date("2025-11-28T10:00:00.000Z");
      const result = formatDateReadable(date);
      expect(result).toContain("28");
      expect(result).toContain("2025");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize first letter", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("WORLD")).toBe("World");
      expect(capitalizeFirstLetter("teST")).toBe("Test");
    });

    it("should handle single character", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });

  describe("formatPercentage", () => {
    it("should format number as percentage", () => {
      expect(formatPercentage(0.5)).toBe("50.00%");
      expect(formatPercentage(0.7532)).toBe("75.32%");
      expect(formatPercentage(1)).toBe("100.00%");
      expect(formatPercentage(0)).toBe("0.00%");
    });
  });

  describe("truncateString", () => {
    it("should truncate long strings", () => {
      const longString = "This is a very long string that needs truncation";
      expect(truncateString(longString, 20)).toBe("This is a very lo...");
    });

    it("should not truncate short strings", () => {
      const shortString = "Short";
      expect(truncateString(shortString, 20)).toBe("Short");
    });

    it("should handle exact length", () => {
      const text = "Exactly 20 chars!!!";
      expect(truncateString(text, 19)).toBe(text);
    });
  });

  describe("objectToQueryString", () => {
    it("should convert object to query string", () => {
      const obj = { name: "John", age: 30, active: true };
      const result = objectToQueryString(obj);
      expect(result).toContain("name=John");
      expect(result).toContain("age=30");
      expect(result).toContain("active=true");
    });

    it("should handle empty object", () => {
      expect(objectToQueryString({})).toBe("");
    });

    it("should skip null and undefined values", () => {
      const obj = { name: "John", age: null, email: undefined };
      const result = objectToQueryString(obj);
      expect(result).toBe("name=John");
    });

    it("should encode special characters", () => {
      const obj = { query: "hello world", email: "test@example.com" };
      const result = objectToQueryString(obj);
      expect(result).toContain("query=hello%20world");
      expect(result).toContain("email=test%40example.com");
    });
  });
});
