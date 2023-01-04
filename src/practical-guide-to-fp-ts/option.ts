import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

interface Foo {
  bar: string;
}

const foo = {
  bar: 'hello',
} as Foo | undefined;

const result = pipe(
  foo,
  O.fromNullable,
  O.map(({ bar }) => bar)
);
//console.log(result);

const null_result = pipe(
  undefined,
  O.fromNullable,
  O.map(({ bar }) => bar)
);
//console.log(null_result);

//----------------

interface Fizz {
  buzz: string;
}

interface Foo2 {
  bar?: Fizz;
}

const foo2 = { bar: undefined } as Foo2 | undefined;

pipe(foo2, (f) => f?.bar?.buzz);

const result2 = pipe(
  foo2,
  O.fromNullable,
  O.map(({ bar }) =>
    pipe(
      bar,
      O.fromNullable,
      O.map(({ buzz }) => buzz)
    )
  ),
  O.flatten,
  O.isSome
);

const result3 = pipe(
  foo2,
  O.fromNullable,
  O.map(({ bar }) => bar),
  O.chain(
    flow(
      O.fromNullable,
      O.map(({ buzz }) => buzz)
    )
  ),
  O.isSome
);

console.log(result2);
console.log(result3);
