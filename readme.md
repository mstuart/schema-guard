# schema-guard

> Create lightweight runtime type guards from a plain object schema

## Install

```sh
npm install schema-guard
```

## Usage

```js
import schemaGuard from 'schema-guard';

const isUser = schemaGuard({
	name: 'string',
	age: 'number',
	email: 'string?',
	tags: 'string[]',
	active: 'boolean',
});

isUser({name: 'Alice', age: 30, tags: ['admin'], active: true});
//=> true

isUser({name: 123});
//=> false
```

## API

### schemaGuard(schema)

Returns a type guard function `(value: unknown) => boolean`.

#### schema

Type: `object`

An object mapping property names to type strings.

Supported types: `string`, `number`, `boolean`, `bigint`, `symbol`, `function`, `object`, `array`.

Use `?` suffix for optional fields (accepts `undefined` and `null`):

```js
{email: 'string?'}
```

Use `[]` suffix for typed arrays:

```js
{tags: 'string[]'}
```

Only declared keys are checked. Extra properties on the input value do not cause failure.

**Limitations**: Nested object validation is not supported. Use `'object'` to check that a property is an object, but its shape will not be validated.

## Related

- [is-runtime](https://github.com/mstuart/is-runtime) - Detect the current JavaScript runtime environment

## License

MIT
