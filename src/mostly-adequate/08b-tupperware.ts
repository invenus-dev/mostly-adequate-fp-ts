import moment, { Moment } from 'moment';
import { add, concat, head, last, prop, split } from './common';

import { flow, pipe, identity } from 'fp-ts/lib/function';
import { map, filter } from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';

export const container = (logger: (...v: any[]) => void) => {
  const trace = (tag: string) => (x: any) => {
    logger(tag, x);
    return x;
  };

  // Pure Error Handling
  // fp-ts version only
  type User = {
    birthDate: string;
  };
  const getAge = (now: Moment) => (user: User) => {
    const birthDate = moment(user.birthDate, 'YYYY-MM-DD');
    return birthDate.isValid()
      ? E.right(now.diff(birthDate, 'years'))
      : E.left('Birth date could not be parsed');
  };

  const now = moment();
  logger(pipe({ birthDate: '2005-12-12' }, getAge(now)));
  logger(pipe({ birthDate: 'July 4, 2001' }, getAge(now)));

  const fortune = flow(
    add(1),
    (i: number) => i.toString(),
    concat('If you survive, you will be ')
  );
  // using E.map
  const zoltar_map = flow(getAge(now), E.map(fortune), logger);
  zoltar_map({ birthDate: '2005-12-12' });
  zoltar_map({ birthDate: 'bogus' });

  // using E.fold
  const zoltar_fold = flow(getAge(now), E.fold(identity, fortune), logger);
  zoltar_fold({ birthDate: '2005-12-12' });
  zoltar_fold({ birthDate: 'bogus' });

  // Old McDonald Had Effects...
  // fp-ts only using IO as per https://cjonas.gitbook.io/mostly-adequate-fp-ts/chapter-08-tupperware#io
  const ioWindow: IO.IO<Window> = () => window; // same as `IO.of(window);`

  const getInnerWidth = (win: Window) => win.innerWidth;
  const ioInnerWidth = IO.map(getInnerWidth)(ioWindow);
  logger(ioInnerWidth());

  const getSplittedUrl = flow(
    IO.map(prop('location')),
    IO.map(prop('href')),
    IO.map(split('/'))
  );
  logger(pipe(ioWindow, getSplittedUrl)());

  const $ = (selector: string) => IO.of(document.querySelectorAll(selector));
  logger($('body')());

  // with pipe combined with flow
  // important: flow needs first function typed correctly
  const getClassOps = flow(
    IO.map((a: NodeListOf<Element>) => Array.from(a)),
    IO.map(head),
    IO.map((div: HTMLElement) => div.className)
  );
  const ioFirstElementClass = pipe($('#js-main'), getClassOps);
  logger(ioFirstElementClass());

  // filtering of params example
  // replaced window.location.href with hardcoded URL for better testability
  const URL =
    'http://local.host/bleh/?action=p&count=4&end=true&searchTerm=true';
  const url = IO.of(URL);
  logger(url());

  // per-parameter ops
  const paramOps = (key: string) =>
    flow(
      split('&'),
      map(split('=')),
      filter(([a, b]) => a === key)
    );

  // whole URL ops
  const urlOps = (key: string) =>
    flow(
      split('?'),
      last,
      O.fromNullable, // could fail if we have no params
      O.map(paramOps(key)), // this just maps to return array of tuple matches
      O.chain((xs) => (xs.length ? O.some(xs[0][1]) : O.none)) // could fail if no match
    );

  const findParam = (key: string) => pipe(url, IO.map(urlOps(key)));
  logger(findParam('searchTerm')());
  logger(findParam('unknown')());
};
