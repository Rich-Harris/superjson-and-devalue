import c from 'kleur';
import * as superjson from 'superjson';
import devalue from 'devalue';

const obj = {
	date: new Date(),
	array: [{ foo: 1 }, { bar: 2 }, { baz: 3 }],
	regex: /the quick brown fox/,
	number: 42
};

const superjson_serialized = superjson.stringify(obj);
const devalue_serialized = devalue(obj);

console.log(
	`superjson output: ${c.bold().cyan(superjson_serialized.length)} bytes`
);
console.log(
	`devalue output: ${c.bold().cyan(devalue_serialized.length)} bytes`
);

// const superjson_deserialized = superjson.parse(superjson_serialized);
// const devalue_deserialized = eval(`(${devalue_serialized})`);

const iterations = 1e6;

function test(fn, label = fn.toString()) {
	const start = Date.now();
	console.log();
	console.log(c.bold(label));
	let i = iterations;
	while (i--) {
		fn();
	}
	console.log(
		`${iterations} iterations in ${c.bold().cyan(Date.now() - start)}ms`
	);
}

// serialization
test(() => superjson.stringify(obj));
test(() => devalue(obj));

// deserialization
test(() => superjson.parse(superjson_serialized));
test(() => eval(`(${devalue_serialized})`));

console.log();
