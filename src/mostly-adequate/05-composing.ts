import { Foldable, map } from 'fp-ts/lib/Array';
import { intercalate } from 'fp-ts/lib/Foldable';
import { flow } from 'fp-ts/lib/function';
import { reduce } from 'fp-ts/lib/ReadonlyArray';
import { Monoid } from 'fp-ts/lib/string';

export const container = (logger: (...v: any) => void) => {
  // Functional Husbandry
  const toUpperCase = (x: string) => x.toUpperCase();
  const exclaim = (x: string) => `${x}!`;

  const shout = flow(toUpperCase, exclaim);
  logger(shout('send in the clowns'));

  const test_arr = ['jumpkick', 'roundhouse', 'uppercut'];
  const head = (x: any) => x[0];
  const reverse = reduce([], (acc: any[], x: any) => [x, ...acc]);
  const last = flow(reverse, head);
  const sortBy = (fn: (arg: any) => any) => (xs: any[]) =>
    xs.sort((a: any, b: any) => {
      if (fn(a) === fn(b)) {
        return 0;
      }
      return fn(a) > fn(b) ? 1 : -1;
    });
  logger(last(test_arr));

  const transformer_1 = flow(flow(reverse, head), toUpperCase);
  const transformer_2 = flow(reverse, flow(head, toUpperCase));
  logger(transformer_1(test_arr), transformer_2(test_arr));

  const lastUpper = flow(reverse, head, toUpperCase);
  const loudLastUpper = flow(reverse, head, toUpperCase, exclaim);
  logger(lastUpper(test_arr), loudLastUpper(test_arr));

  // Pointfree
  const replace =
    (search: string | RegExp) => (replace: string) => (s: string) =>
      s.replace(search, replace);
  const split = (search: string | RegExp) => (s: string) => s.split(search);
  const toLower = (s: string) => s.toLocaleLowerCase();
  const toUpper = (s: string) => s.toLocaleUpperCase();
  const stringIntercalculate = (sep: string) => (s: string[]) =>
    intercalate(Monoid, Foldable)(sep, s);
  const trace = (tag: string) => (x: any) => {
    logger(tag, x);
    return x;
  };

  const snakeCase = flow(toLower, replace(/\s+/gi)('_'));
  logger(snakeCase('Snake case test'));

  const initials = flow(
    split(' '),
    map(flow(head, toUpper)),
    stringIntercalculate('. ')
  );
  logger(initials('hunter stock thompson'));

  // Debugging
  const dasherize = flow(
    split(' '),
    map(toLower),
    trace('afterLower'),
    stringIntercalculate('-')
  );

  logger(dasherize('The world is a vampire'));

  // Exercises
  const prop = (property: string) => (object: any) => object[property];

  type Car = {
    name: string;
    horsepower: number;
    dollar_value: number;
    in_stock: boolean;
  };
  const car_set: Car[] = [
    {
      name: 'Aston Martin One-77',
      horsepower: 750,
      dollar_value: 1850000,
      in_stock: true,
    },
    {
      name: 'Bugatti Veyron Old Model',
      horsepower: 500,
      dollar_value: 4350000,
      in_stock: false,
    },
  ];

  const isLastInStock = flow(last, prop('in_stock'));
  logger(isLastInStock(car_set));

  const add = (a: number, b: number) => a + b;
  const average = (xs: number[]) => reduce(0, add)(xs) / xs.length;
  const averageDollarValue = flow(map(prop('dollar_value')), average);
  logger(averageDollarValue(car_set));

  const append = (s: string) => (appendOn: string) => appendOn + ' ' + s;
  const fastestCar = flow(
    sortBy(prop('horsepower')),
    last,
    prop('name'),
    append('is the fastest')
  );
  logger(fastestCar(car_set));
};
