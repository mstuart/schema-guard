import test from 'ava';
import schemaGuard from './index.js';

test('validates string type', t => {
	const guard = schemaGuard({name: 'string'});
	t.true(guard({name: 'Alice'}));
	t.false(guard({name: 42}));
});

test('validates number type', t => {
	const guard = schemaGuard({age: 'number'});
	t.true(guard({age: 30}));
	t.false(guard({age: '30'}));
});

test('validates boolean type', t => {
	const guard = schemaGuard({active: 'boolean'});
	t.true(guard({active: true}));
	t.true(guard({active: false}));
	t.false(guard({active: 'true'}));
});

test('validates bigint type', t => {
	const guard = schemaGuard({id: 'bigint'});
	t.true(guard({id: 1n}));
	t.false(guard({id: 1}));
});

test('validates symbol type', t => {
	const guard = schemaGuard({key: 'symbol'});
	t.true(guard({key: Symbol('test')}));
	t.false(guard({key: 'symbol'}));
});

test('validates function type', t => {
	const guard = schemaGuard({callback: 'function'});
	t.true(guard({callback() {}}));
	t.false(guard({callback: 'fn'}));
});

test('validates object type', t => {
	const guard = schemaGuard({data: 'object'});
	t.true(guard({data: {}}));
	t.true(guard({data: {key: 'value'}}));
	t.false(guard({data: 'object'}));
	t.false(guard({data: null}));
});

test('validates array type', t => {
	const guard = schemaGuard({items: 'array'});
	t.true(guard({items: []}));
	t.true(guard({items: [1, 2, 3]}));
	t.false(guard({items: 'array'}));
});

test('optional fields accept undefined', t => {
	const guard = schemaGuard({email: 'string?'});
	t.true(guard({email: undefined}));
	t.true(guard({}));
});

test('optional fields accept null', t => {
	const guard = schemaGuard({email: 'string?'});
	t.true(guard({email: null}));
});

test('optional fields accept the base type', t => {
	const guard = schemaGuard({email: 'string?'});
	t.true(guard({email: 'test@example.com'}));
});

test('typed array validates element types', t => {
	const guard = schemaGuard({tags: 'string[]'});
	t.true(guard({tags: ['a', 'b', 'c']}));
	t.false(guard({tags: [1, 2, 3]}));
	t.false(guard({tags: 'not an array'}));
});

test('typed array accepts empty array', t => {
	const guard = schemaGuard({tags: 'string[]'});
	t.true(guard({tags: []}));
});

test('number array validates element types', t => {
	const guard = schemaGuard({scores: 'number[]'});
	t.true(guard({scores: [1, 2, 3]}));
	t.false(guard({scores: ['1', '2', '3']}));
});

test('missing required fields return false', t => {
	const guard = schemaGuard({name: 'string', age: 'number'});
	t.false(guard({name: 'Alice'}));
	t.false(guard({age: 30}));
	t.false(guard({}));
});

test('extra properties do not cause failure', t => {
	const guard = schemaGuard({name: 'string'});
	t.true(guard({name: 'Alice', extra: true, another: 42}));
});

test('null input returns false', t => {
	const guard = schemaGuard({name: 'string'});
	t.false(guard(null));
});

test('undefined input returns false', t => {
	const guard = schemaGuard({name: 'string'});
	t.false(guard(undefined));
});

test('string input returns false', t => {
	const guard = schemaGuard({name: 'string'});
	t.false(guard('string'));
});

test('number input returns false', t => {
	const guard = schemaGuard({name: 'string'});
	t.false(guard(42));
});

test('combined schema with multiple types', t => {
	const guard = schemaGuard({
		name: 'string',
		age: 'number',
		active: 'boolean',
		tags: 'string[]',
		email: 'string?',
	});
	t.true(guard({
		name: 'Alice', age: 30, active: true, tags: ['admin'],
	}));
	t.true(guard({
		name: 'Alice', age: 30, active: true, tags: ['admin'], email: 'a@b.com',
	}));
	t.false(guard({
		name: 'Alice', age: 30, active: true, tags: [1],
	}));
});

test('schemaGuard returns a function', t => {
	const guard = schemaGuard({name: 'string'});
	t.is(typeof guard, 'function');
});

test('empty schema accepts any object', t => {
	const guard = schemaGuard({});
	t.true(guard({}));
	t.true(guard({anything: 'goes'}));
});

test('empty schema still rejects non-objects', t => {
	const guard = schemaGuard({});
	t.false(guard(null));
	t.false(guard(undefined));
	t.false(guard('string'));
});

test('object type rejects arrays', t => {
	const guard = schemaGuard({data: 'object'});
	t.false(guard({data: [1, 2, 3]}));
});

test('boolean array validates correctly', t => {
	const guard = schemaGuard({flags: 'boolean[]'});
	t.true(guard({flags: [true, false, true]}));
	t.false(guard({flags: [true, 'false']}));
});

test('mixed valid and invalid fields', t => {
	const guard = schemaGuard({name: 'string', age: 'number'});
	t.false(guard({name: 'Alice', age: 'thirty'}));
	t.false(guard({name: 42, age: 30}));
});
