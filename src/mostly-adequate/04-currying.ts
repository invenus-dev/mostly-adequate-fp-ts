import { map, reduce } from 'fp-ts/ReadonlyArray';

export const container = (logger: (...v: any) => void) => {
  // set of curried functions manually defined because of TS
  const match = (what: RegExp) => (str: string) => str.match(what) !== null;
  const replace = (what: RegExp) => (replacement: string) => (str: string) =>
    str.replace(what, replacement);
  const filter = (filter_fn: (s: string) => boolean) => (xs: string[]) =>
    xs.filter(filter_fn);
  const our_map = (map_fn: (s: string) => any) => (xs: string[]) =>
    xs.map(map_fn);
  const split = (split_by: string) => (split_on: string) =>
    split_on.split(split_by);

  // usage examples
  const hasLetterR = match(/r/g);
  logger(hasLetterR('hello world'));
  logger(hasLetterR('just j and s and t etc'));

  const removeStringsWithoutRs = filter(hasLetterR);
  logger(
    removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle'])
  );

  const noVowels = replace(/[aeiou]/gi);
  const censored = noVowels('*');
  logger(censored('Chocolate Rain'));

  const toLength = (s: string) => s.length;
  const lenghtize = our_map(toLength);
  logger(lenghtize(['hey', 'Marija']));

  const getChildren = (x: HTMLElement) => x.childNodes;
  const allTheChildren = map(getChildren);

  // prepare elements in HTML to test this
  const elements = [
    document.getElementById('children1')!,
    document.getElementById('children2')!,
  ];
  logger(allTheChildren(elements));

  // exercises
  const words = split(' ');
  logger(words('this is a sentence'));

  const filterQs = filter(match(/q/i));
  logger(filterQs(['Quido', 'kizd', 'quinsling']));

  const keepHighest = (x: number, y: number) => (x >= y ? x : y);
  const max = reduce(-Infinity, keepHighest); // fp-ts reduce flips param order
  logger(max([1, 2, 3, -7]));
};
