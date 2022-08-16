# superjson-and-devalue

quick script to compare the performance/output of [superjson](https://github.com/blitz-js/superjson) and [devalue](https://github.com/Rich-Harris/devalue), following [this Twitter thread](https://twitter.com/flybayer/status/1285964795183652867).

```
git clone git@github.com:Rich-Harris/superjson-and-devalue
cd superjson-and-devalue
npm i
node index.js
```

The sample object is small and simple — different objects may have different outcomes.

Note: I couldn't get things like Sets or repeated references to work with superjson (it complained about circular references).

![superjson and devalue results](results.png)

## Bundle size

To see how much `superjson.deserialize` adds to the client bundle, run this:

```
npm run build
cat bundled.js | wc -c
```

(With Terser installed globally, you can do `cat bundled.js | terser -cm | wc -c` to check minified size, or chuck a `| gzip -9` in there to see zipped size.)

## Results

In node 16.15.1 on an M1 Max, `devalue@2.0.1` handily beats `superjson@1.9.1` on all tests:

```
superjson output: 183 bytes
devalue output: 116 bytes

() => superjson.stringify(obj)
1000000 iterations in 8543ms

() => devalue(obj)
1000000 iterations in 3190ms

() => superjson.parse(superjson_serialized)
1000000 iterations in 3343ms

() => eval(`(${devalue_serialized})`)
1000000 iterations in 261ms
```

`superjson.deserialize` adds 12.3kb to your client bundle size. (`devalue` adds 0kb, because there's no runtime.)
