import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'bundle-test.js',
	output: {
		file: 'bundled.js',
		format: 'esm'
	},
	plugins: [nodeResolve()]
};
