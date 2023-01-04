import axios from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

(async () => {
  const pipeline = pipe(
    TE.tryCatch(
      () => axios.get('https://httpstat.us/500'),
      (reason) => new Error(`${reason}`)
    ),
    TE.map((resp) => resp.data)
  );
  console.log(pipeline);
  const ok = await pipeline();

  console.log(ok);
})();
