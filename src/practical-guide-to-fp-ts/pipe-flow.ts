import { pipe, flow } from 'fp-ts/lib/function';

function add1(num: number): number {
  return num + 1;
}

function multiply2(num: number): number {
  return num * 2;
}

function toString(num: number): string {
  return `${num}`;
}

const result_pipe = pipe(1, add1, multiply2, toString); // 4
console.log('result_pipe', result_pipe);

const result_flow = pipe(1, flow(add1, multiply2, toString));
console.log('result_flow', result_flow);
console.log('result_flow_fn', flow(add1, multiply2, toString)(1));

function concat(
  a: number,
  transformer: (a: number) => string
): [number, string] {
  return [a, transformer(a)];
}

console.log(
  'manual concat',
  concat(4, (n) => `${n + 1}+1`)
);

console.log('flowing concat', concat(1, flow(add1, multiply2, toString)));
