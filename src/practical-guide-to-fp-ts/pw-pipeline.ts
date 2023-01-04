import { flow, identity, pipe } from 'fp-ts/lib/function';
import * as Password from './password';
import crypto from 'crypto';
import * as E from 'fp-ts/lib/Either';

const hashFn: Password.HashFn = (value) =>
  E.right(crypto.createHash('md5').update(value).digest('hex'));

export const pipeline = flow(
  Password.of,
  Password.validate({ minLength: 8, capitalLetterRequired: true }),
  E.chainW(Password.hash(hashFn))
);

// example usage
// console.log(pipe('Password123', pipeline));
