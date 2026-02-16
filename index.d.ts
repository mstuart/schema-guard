export type SchemaType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'bigint'
	| 'symbol'
	| 'function'
	| 'object'
	| 'array'
	| `${string}?`
	| `${string}[]`;

export type Schema = Record<string, SchemaType>;

/**
Create a lightweight runtime type guard from a plain object schema.

Supported types: `string`, `number`, `boolean`, `bigint`, `symbol`, `function`, `object`, `array`.

Use `?` suffix for optional fields and `[]` suffix for typed arrays.

@param schema - The schema object mapping keys to type strings.
@returns A type guard function that checks if a value matches the schema.

@example
```
import schemaGuard from 'schema-guard';

const isUser = schemaGuard({
	name: 'string',
	age: 'number',
	email: 'string?',
	tags: 'string[]',
});

isUser({name: 'Alice', age: 30, tags: ['admin']});
//=> true

isUser({name: 'Alice'});
//=> false
```
*/
export default function schemaGuard(schema: Schema): (value: unknown) => boolean;
