import moment, { Moment } from 'moment';
import {
  add,
  concat,
  head,
  last,
  prop,
  split,
  append,
  sortBy,
  id,
} from './common';
import jQuery from 'jquery';
import Mustache from 'mustache';

import { flow, pipe, identity } from 'fp-ts/lib/function';
import { map, filter } from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IO';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';

export const container = async (logger: (...v: any[]) => void) => {
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

  // Asynchronous Tasks
  const getJSON =
    <T>(url: string) =>
    (params: Record<string, any>) =>
      TE.tryCatch(
        () =>
          new Promise<T>((resolve, reject) => {
            jQuery
              .getJSON(url, params, resolve)
              .fail((e) => reject(new Error(e.statusText)));
          }),
        (reason) => new Error(String(reason))
      );

  await (async () => {
    logger('video json tests');

    type Video = { title: string };

    const jsonResult = (fileUrl: string) =>
      pipe(
        { id: 10 },
        getJSON<Video>(fileUrl),
        TE.map(prop('title')),
        TE.fold((e) => T.of(e.message), T.of)
      );

    // testing: Task is async code
    const failed = await jsonResult('/fail.json')();
    logger('failed: ', failed);

    const ok = await jsonResult('/video.json')();
    logger('ok: ', ok);
  })();

  await (async () => {
    logger('blog post tests');

    const blogTemplate = `
    <div class="blogs">
      {{#.}}
        <div class="blogPost">
          <h2 class="title">{{title}}</h2>
          <h6 class="date">{{date}}</h6>
          <div class="author">{{author}}</div>
        </div>
      {{/.}}
    </div>
    `;

    type BlogData = {
      title: string;
      date: string;
      author: string;
    };

    // blogPage :: Posts -> HTML
    // replaced Handlebars with Mustache:
    // Handlebars sucks when it comes to webpack/TS automated browser build :-(
    const blogPage = (data: BlogData[]) => Mustache.render(blogTemplate, data);

    // sortBy is my custom implementation
    const renderPage = flow(sortBy<BlogData, string>(prop('date')), blogPage);

    // here, you can tweak with file name to trigger error
    const blog = flow(getJSON<BlogData[]>('/posts.json'), TE.map(renderPage));

    const result = await blog({})();
    logger(
      pipe(
        result,
        E.fold(
          (err) => jQuery('#blog-error').html(err.message),
          (page) => jQuery('#blog-container').html(page)
        )
      )
    );
  })();

  // Exercises
  // Exercise 1
  const incrF = flow(O.map(add(1)));
  logger(
    pipe(
      O.fromNullable(2),
      incrF,
      O.fold(() => -1, id)
    )
  );

  // Exercise 2
  type UserEx = {
    id: number;
    name: string;
    active: boolean;
  };
  const user: UserEx = { id: 2, name: 'Albert', active: true };
  const user_prohibited: UserEx = { id: 3, name: 'Caroline', active: false };
  const user_short: UserEx = { id: 4, name: 'Li', active: true };

  // initial :: User -> Maybe String
  const initial = flow(prop('name'), O.fromNullable, O.map(head));
  logger(
    pipe(
      user,
      initial,
      O.fold(() => 'error', id)
    )
  );

  // Exercise 3
  const showWelcome = flow(prop('name'), append('Welcome '));
  const checkActive = (u: UserEx) =>
    u.active ? E.of(u) : E.left('Your account is not active');

  // eitherWelcome :: User -> Either String String
  const eitherWelcome = flow(checkActive, E.map(showWelcome), E.fold(id, id));
  logger(pipe(user, eitherWelcome));
  logger(pipe(user_prohibited, eitherWelcome));

  // Exercise 4
  interface Validator {
    (u: UserEx): E.Either<string, UserEx>;
  }
  const validateUser = (validate: Validator) => (u: UserEx) =>
    pipe(u, validate);

  const save = (u: UserEx) => IO.of({ ...u, saved: true });

  const validateName = (u: UserEx) =>
    u.name.length > 3 ? E.right(u) : E.left('Your name need to be > 3');

  const saveAndWelcome = flow(save, IO.map(showWelcome));

  const register = flow(validateUser(validateName), E.map(saveAndWelcome));

  const commitRegister = (u: UserEx) =>
    pipe(
      u,
      register,
      E.fold(id, (a) => a())
    );

  logger(commitRegister(user));
  logger(commitRegister(user_short));
};
