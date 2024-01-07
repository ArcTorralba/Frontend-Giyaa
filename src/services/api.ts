import { getSession } from 'next-auth/react';
import wretch, { FetchLike } from 'wretch';
import FormDataAddon from 'wretch/addons/formData';
import QueryStringAddon from 'wretch/addons/queryString';
import { getUserSession } from './auth';

const authMiddleware =
  (next: FetchLike): FetchLike =>
  async (url, opts) => {
    if (url.split('/').some((p) => p === 'auth')) {
      return next(url, opts);
    }

    let token = opts.context.token;

    if (!token) {
      if (typeof window === 'undefined') {
        const session = await getUserSession();
        token = session?.user.token ?? '';
      } else {
        const session = await getSession();
        token = session?.user.token ?? '';
      }
    }

    if (token) {
      opts.context.token = token;
      return next(url, {
        ...opts,
        headers: {
          ...(opts.headers || {}),
          Authorization: `Token ${token}`,
        },
      });
    }

    return next(url, opts);
  };

export const urlMiddleware =
  (next: FetchLike): FetchLike =>
  async (url, opts) => {
    if (url.includes('login')) {
      return next(url, opts);
    }
    const newURL = new URL(url);
    const hasParams = !!newURL.searchParams.toString();
    return next(
      hasParams
        ? `${newURL.origin}${newURL.pathname}?${newURL.searchParams.toString()}`
        : `${url}/`,
      opts,
    );
  };

export const restAPI = wretch(process.env.NEXT_PUBLIC_API_URL)
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
  .middlewares([authMiddleware, urlMiddleware])
  .options({
    context: { token: '' },
    cache: 'no-store',
  })
  .errorType('json')
  .resolve(async (r) => {
    return r.res((b) => (b.status === 204 ? {} : b.json()));
  });

export const invalidatePath = (path: string) =>
  wretch('/api')
    .addon(QueryStringAddon)
    .url('/revalidate')
    .query({ path })
    .post()
    .json();
