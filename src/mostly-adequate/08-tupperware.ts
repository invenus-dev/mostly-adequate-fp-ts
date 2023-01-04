import { inspect } from './common';

class Container<T> {
  constructor(private x: T) {}

  static of(x: any) {
    return new Container(x);
  }

  map<U>(fn: (a: T) => U): Container<U> {
    return Container.of(fn(this.x));
  }
}

class Maybe<T> {
  constructor(private x: T) {}

  static of(x: any) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.x === null || this.x === undefined;
  }

  map<U>(fn: (a: T) => U): Maybe<U> {
    return this.isNothing ? this : Maybe.of(fn(this.x));
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.x)})`;
  }
}

// helper fns
const prop = (property: string) => (object: any) => object[property];
const append = (string_to_add: string) => (original_string: string) =>
  original_string + ' ' + string_to_add;
const match = (what: RegExp) => (str: string) => str.match(what) !== null;
const add = (x: number) => (y: number) => x + y;

export const container = (logger: (v: any) => void) => {
  // The Mighty Container
  logger(Container.of(3));
  logger(Container.of('hotdogs'));
  logger(Container.of(Container.of({ name: 'yoda' })));

  // My First Functor
  logger(Container.of('string').map((arg) => arg.length));
  logger(Container.of('flamethrowers').map((s) => s.toUpperCase()));
  logger(Container.of('bombs').map(append('away')).map(prop('length')));

  // Schrödinger's Maybe
  logger(Maybe.of('Malkovich Malkovich').map(match(/a/gi)).inspect());
  logger(Maybe.of(null).map(match(/a/gi)).inspect());
  logger(Maybe.of({ name: 'Boris' }).map(prop('age')).map(add(10)).inspect());
  logger(
    Maybe.of({ name: 'Boris', age: 12 }).map(prop('age')).map(add(10)).inspect()
  );
};
