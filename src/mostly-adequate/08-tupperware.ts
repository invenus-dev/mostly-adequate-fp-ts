class Container<T> {
  constructor(private $value: T) {}

  static of(x: any) {
    return new Container(x);
  }

  map<U>(f: (a: T) => U): Container<U> {
    return Container.of(f(this.$value));
  }
}

// helper fns
const prop = (property: string) => (object: any) => object[property];
const append = (string_to_add: string) => (original_string: string) =>
  original_string + ' ' + string_to_add;

export const container = (logger: (v: any) => void) => {
  // The Mighty Container
  logger(Container.of(3));
  logger(Container.of('hotdogs'));
  logger(Container.of(Container.of({ name: 'yoda' })));

  // My First Functor
  logger(Container.of('string').map((arg) => arg.length));
  logger(Container.of('flamethrowers').map((s) => s.toUpperCase()));
  logger(Container.of('bombs').map(append('away')).map(prop('length')));
};
