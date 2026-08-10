import { expectError, expectType } from "tsd";
import schemaGuard from "./index.js";

const guard = schemaGuard({ age: "number", name: "string" });
expectType<(value: unknown) => boolean>(guard);
expectType<boolean>(guard({ age: 1, name: "test" }));

expectError(schemaGuard());
expectError(schemaGuard({ name: 123 }));
