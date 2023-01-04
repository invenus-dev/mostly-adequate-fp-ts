import { map, reduce } from 'fp-ts/ReadonlyArray';

export const container = () => {
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
  console.log(hasLetterR('hello world'));
  console.log(hasLetterR('just j and s and t etc'));

  const removeStringsWithoutRs = filter(hasLetterR);
  console.log(
    removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle'])
  );

  const noVowels = replace(/[aeiou]/gi);
  const censored = noVowels('*');
  console.log(censored('Chocolate Rain'));

  const toLength = (s: string) => s.length;
  const lenghtize = our_map(toLength);
  console.log(lenghtize(['hey', 'Marija']));

  const getChildren = (x: HTMLElement) => x.childNodes;
  const allTheChildren = map(getChildren);

  // prepare elements in HTML to test this
  const elements = [
    document.getElementById('children1')!,
    document.getElementById('children2')!,
  ];
  console.log(allTheChildren(elements));

  // exersises
  const words = split(' ');
  console.log(words('this is a sentence'));

  const filterQs = filter(match(/q/i));
  console.log(filterQs(['Quido', 'kizd', 'quinsling']));

  const keepHighest = (x: number, y: number) => (x >= y ? x : y);
  const max = reduce(-Infinity, keepHighest); // fp-ts reduce flips param order
  console.log(max([1, 2, 3, -7]));
};
