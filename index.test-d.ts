import {expectType, expectError} from 'tsd';
import schemaGuard from './index.js';

const guard = schemaGuard({name: 'string', age: 'number'});
expectType<(value: unknown) => boolean>(guard);
expectType<boolean>(guard({name: 'test', age: 1}));

expectError(schemaGuard());
expectError(schemaGuard({name: 123}));
