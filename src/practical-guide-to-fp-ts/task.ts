import * as T from 'fp-ts/lib/Task';

// ---------------- TASK --------------

async function b() {
  const foo = 'asdf';
  // method 1
  const bar = T.of(foo);
  console.log(await bar());

  // method 2
  const bar2: T.Task<string> = async () => Promise.resolve(foo);
  console.log(await bar2());
}
b();

// ----------------- EITHER ---------------
