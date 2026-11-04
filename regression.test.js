import test from "ava";
import schemaGuard from "./index.js";

test("object-array items follow the same rules as object fields", (t) => {
  const guard = schemaGuard({ values: "object[]" });
  t.true(guard({ values: [{}, { valid: true }] }));
  t.false(guard({ values: [null] }));
  t.false(guard({ values: [[]] }));
});

test("array-array schemas validate every element as an array", (t) => {
  const guard = schemaGuard({ values: "array[]" });
  t.true(guard({ values: [[], [1], ["x"]] }));
  t.false(guard({ values: [1] }));
  t.false(guard({ values: [null] }));
});

test("optional typed arrays accept present valid values and reject bad items", (t) => {
  const guard = schemaGuard({ values: "string[]?" });
  t.true(guard({}));
  t.true(guard({ values: null }));
  t.true(guard({ values: ["a", "b"] }));
  t.true(guard({ values: [] }));
  t.false(guard({ values: [1] }));
  t.false(guard({ values: "a" }));
});

test("typed arrays validate sparse positions as undefined", (t) => {
  const values = ["a"];
  values.length = 2;
  t.false(schemaGuard({ values: "string[]" })({ values }));
  t.true(schemaGuard({ values: "string?[]" })({ values }));
  t.true(schemaGuard({ values: "string[]" })({ values: [] }));
});

test("typed arrays inspect indexed values when iteration is customized", (t) => {
  const values = ["wrong"];
  Object.defineProperty(values, Symbol.iterator, {
    *value() {
      yield 1;
    },
  });
  t.false(schemaGuard({ values: "number[]" })({ values }));
});

test("typed arrays retain the initial length when a getter extends input", (t) => {
  const values = ["ok"];
  Object.defineProperty(values, 0, {
    get() {
      values.push(1);
      return "ok";
    },
  });
  t.true(schemaGuard({ values: "string[]" })({ values }));
  t.is(values.length, 2);
});
