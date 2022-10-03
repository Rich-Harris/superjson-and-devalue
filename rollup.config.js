import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'bundle-size/input-superjson.js',
		output: {
			file: 'bundle-size/output-superjson.js',
			format: 'esm'
		},
		plugins: [nodeResolve()]
	},
	{
		input: 'bundle-size/input-devalue-parse.js',
		output: {
			file: 'bundle-size/output-devalue-parse.js',
			format: 'esm'
		},
		plugins: [nodeResolve()]
	}
];
