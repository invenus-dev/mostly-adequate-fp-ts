import moment, { Moment } from 'moment';
import { add } from './common';

import { flow, pipe } from 'fp-ts/lib/function';
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

  const fortune = flow();
};
