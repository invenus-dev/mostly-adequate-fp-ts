import * as O from 'fp-ts/Option';
import { pipe, flow } from 'fp-ts/lib/function';
import { inspect, prop, match, add, append } from './common';

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

export const container = (logger: (...v: any[]) => void) => {
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

  // Schrödinger's Maybe - implemented by fp-ts
  // 1: scalar - simple pipe
  logger(
    pipe('Malkovich Malkovich', O.fromNullable, O.map(match(/a/gi)), inspect)
  );
  logger(pipe(null, O.fromNullable, O.map(match(/a/gi)), inspect));

  // 2: complex object - flow
  type Person = {
    name: string;
    age?: number;
  };
  const borisJustName: Person = { name: 'Boris' };
  const borisWithAge: Person = { name: 'Boris', age: 12 };
  const optionedPerson = (person: Person) => O.of(person);

  // flatmap: https://rlee.dev/practical-guide-to-fp-ts-part-2
  const personFlow = flow(
    optionedPerson,
    O.map(({ age }) => age),
    O.chain(flow(O.fromNullable, O.map(add(10)))),
    inspect
  );
  logger(personFlow(borisJustName));
  logger(personFlow(borisWithAge));

  // Use cases
  // fp-ts only
  const safeHead = (xs: any[]) => O.fromNullable(xs[0]);
  const streetName = flow(prop('addresses'), safeHead, O.map(prop('street')));
  logger(streetName({ addresses: [] }));
  logger(streetName({ addresses: [{ street: 'Main St.' }] }));

  // from https://cjonas.gitbook.io/mostly-adequate-fp-ts/chapter-08-tupperware
  type Account = { balance: number };
  const withdraw =
    (amount: number) =>
    ({ balance }: Account): O.Option<Account> =>
      balance >= amount ? O.some({ balance: balance - amount }) : O.none;
  const updateLedger = (account: Account) => account;
  const remainingBalance = ({ balance }: Account) =>
    `Your balance is $${balance}`;
  const finishTransaction = flow(updateLedger, remainingBalance);

  const getTwentyReturnOption = flow(withdraw(20), O.map(finishTransaction));
  logger(getTwentyReturnOption({ balance: 200 }));
  logger(getTwentyReturnOption({ balance: 10 }));

  // Releasing the Value
  // O.fold is the equivalent of "maybe" in Mostly Adequate
  const getTwenty = flow(
    withdraw(20),
    O.map(finishTransaction),
    O.fold(
      () => 'You broke',
      (str) => str
    )
  );
  logger(getTwenty({ balance: 200 }));
  logger(getTwenty({ balance: 10 }));
};
