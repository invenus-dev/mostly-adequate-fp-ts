import moment, { Moment } from 'moment';
import { add, concat } from './common';

import { flow, pipe, identity } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';

export const container = (logger: (...v: any[]) => void) => {
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
};
