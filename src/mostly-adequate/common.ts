export function prop<K extends string>(
  k: K
): <T extends Record<K, any>>(obj: T) => T[K];
export function prop<K extends keyof T, T extends object>(k: K, obj: T): T[K];
export function prop<K extends string, T extends Record<K, any>>(
  k: K,
  obj?: T
): T[K] | ((obj: T) => T[K]) {
  if (obj === undefined) {
    return <T extends Record<K, any>>(obj: T): T[K] => obj[k];
  } else {
    return obj[k];
  }
}

// taken from github.com/MostlyAdequate/mostly-adequate-guide/
export function inspect(x: any): any {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f: Function) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t: any) {
    switch (typeof t) {
      case 'string':
        return `'${t}'`;
      case 'object': {
        const ts = Object.keys(t).map((k) => [k, inspect(t[k])]);
        return `{${ts.map((kv) => kv.join(': ')).join(', ')}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args: any) {
    return Array.isArray(args)
      ? `[${args.map(inspect).join(', ')}]`
      : inspectTerm(args);
  }

  return typeof x === 'function' ? inspectFn(x) : inspectArgs(x);
}
