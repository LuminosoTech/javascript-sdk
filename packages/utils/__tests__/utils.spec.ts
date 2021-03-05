/// <reference types="jest" />
import { groupBy, objectEntries, objectValues, find, keyBy, printf } from "../src";

describe("utils", () => {
  describe("groupBy", () => {
    it("should group values by some key function", () => {
      const input = [
        { firstName: "jordan", lastName: "foo" },
        { firstName: "jordan", lastName: "bar" },
        { firstName: "james", lastName: "foxy" },
      ];
      const result = groupBy(input, (item) => item.firstName);

      expect(result).toEqual([
        [
          { firstName: "jordan", lastName: "foo" },
          { firstName: "jordan", lastName: "bar" },
        ],
        [{ firstName: "james", lastName: "foxy" }],
      ]);
    });
  });

  describe("objectEntries", () => {
    it("should return object entries", () => {
      expect(objectEntries({ foo: "bar", bar: 123 })).toEqual([
        ["foo", "bar"],
        ["bar", 123],
      ]);
    });
  });

  describe("objectValues", () => {
    it("should return object values", () => {
      expect(objectValues({ foo: "bar", bar: 123 })).toEqual(["bar", 123]);
    });
  });

  describe("find", () => {
    it("should return the value if found in an array", () => {
      const input = [
        { firstName: "jordan", lastName: "foo" },
        { firstName: "jordan", lastName: "bar" },
        { firstName: "james", lastName: "foxy" },
      ];

      expect(find(input, (item) => item.firstName === "jordan")).toEqual({
        firstName: "jordan",
        lastName: "foo",
      });
    });

    it("should return undefined if NOT found in an array", () => {
      const input = [
        { firstName: "jordan", lastName: "foo" },
        { firstName: "jordan", lastName: "bar" },
        { firstName: "james", lastName: "foxy" },
      ];

      expect(find(input, (item) => item.firstName === "joe")).toBeUndefined();
    });
  });

  describe("keyBy", () => {
    it("return an object with keys generated from the key function", () => {
      const input = [
        { key: "foo", firstName: "jordan", lastName: "foo" },
        { key: "bar", firstName: "jordan", lastName: "bar" },
        { key: "baz", firstName: "james", lastName: "foxy" },
      ];

      expect(keyBy(input, (item) => item.key)).toEqual({
        foo: { key: "foo", firstName: "jordan", lastName: "foo" },
        bar: { key: "bar", firstName: "jordan", lastName: "bar" },
        baz: { key: "baz", firstName: "james", lastName: "foxy" },
      });
    });
  });

  describe("print", () => {
    it("print(msg)", () => {
      expect(printf("this is my message")).toBe("this is my message");
    });

    it("print(msg, arg1)", () => {
      expect(printf("hi %s", "jordan")).toBe("hi jordan");
    });

    it("print(msg, arg1, arg2)", () => {
      expect(printf("hi %s its %s", "jordan", "jon")).toBe("hi jordan its jon");
    });

    it("should print undefined if an argument is missing", () => {
      expect(printf("hi %s its %s", "jordan")).toBe("hi jordan its undefined");
    });

    it("should evaluate a function", () => {
      expect(printf("hi %s its %s", "jordan", () => "a function")).toBe("hi jordan its a function");
    });

    it("should work with numbers", () => {
      expect(printf("hi %s", 123)).toBe("hi 123");
    });

    it("should not error when passed an object", () => {
      expect(printf("hi %s", { foo: "bar" })).toBe("hi [object Object]");
    });
  });
});
