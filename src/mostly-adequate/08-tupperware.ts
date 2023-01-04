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

export const container = () => {
  // The Mighty Container
  console.log(Container.of(3));
  console.log(Container.of('hotdogs'));
  console.log(Container.of(Container.of({ name: 'yoda' })));

  // My First Functor
  console.log(Container.of('string').map((arg) => arg.length));
  console.log(Container.of('flamethrowers').map((s) => s.toUpperCase()));
  console.log(Container.of('bombs').map(append('away')).map(prop('length')));
};
