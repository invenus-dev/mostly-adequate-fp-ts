import { flow } from 'fp-ts/lib/function';
import { map } from 'fp-ts/lib/ReadonlyArray';
import $ from 'jquery';
import { prop } from './common';

export const container = (logger: (...v: any) => void) => {
  const Impure = {
    getJSON: (callback: Function) => (url: string) => $.getJSON(url, callback),
    setHtml: (sel: string) => (html: any) => $(sel).html(html),
    trace: (tag: string) => (x: any) => {
      console.log(tag, x);
      return x;
    },
  };

  // url construction
  const host = 'api.flickr.com';
  const path = '/services/feeds/photos_public.gne';
  const query = (search_text: string) =>
    `?tags=${search_text}&format=json&jsoncallback=?`;
  const assemble_url = (query: string) => `https://${host}${path}${query}`;
  const url = flow(query, assemble_url);

  // make image
  const img = (src: any) => $('<img>', { src });

  // extraction and transform flow
  const mediaUrl = flow(prop('media'), prop('m'));
  const mediaToImg = flow(mediaUrl, img);
  const images = flow(prop('items'), map(mediaToImg));

  // actual rendering
  const render = flow(images, Impure.setHtml('#js-main'));

  // data fetching
  const app = flow(url, Impure.getJSON(render));

  // initialization with search term
  logger('Starting app in browser');
  app('bricks');
};
