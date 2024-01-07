import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
import wretch from 'wretch';
import { z } from 'zod';
import { restAPI } from './api';
import { userSchema } from './users';

const api = wretch(process.env.NEXT_PUBLIC_API_URL)
  .errorType('json')
  .resolve((r) => {
    return r.res((res) => {
      console.log('res', res.status);
      return res.json();
    });
  });

const USER_ROLES = {
  carer: 'carer',
  admin: 'admin',
  professional: 'professional',
} as const;

export const authResponseSchema = z.object({
  id: z.number(),
  role: z.nativeEnum(USER_ROLES),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    is_staff: z.boolean(),
  }),
  token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    newUser: '/register',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...user,
          ...token,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const response = await restAPI.url('/auth/login/').post({
          username: credentials?.email,
          password: credentials?.password,
        });
        const parsed = authResponseSchema.parse(response);
        const userResponse: any = await api
          .url(`/users/${parsed.user.id}/`)
          .auth(`Token ${parsed.token}`)
          .get();

        const parsedUser = userSchema
          .pick({ professional_id: true, carer_id: true })
          .parse({
            professional_id: userResponse?.professional?.id,
            carer_id: userResponse?.carer?.id,
          });

        // If no error and we have user data, return it
        if (response && parsed) {
          const { user, ...authResponse } = parsed;
          return {
            ...authResponse,
            ...user,
            carerId: parsedUser.carer_id,
            professionalId: parsedUser.professional_id,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
      type: 'credentials',
    }),
  ],
} satisfies NextAuthOptions;

// Use it in server contexts
export async function getUserSession() {
  const session = await getServerSession(config);
  if (!session) {
    redirect('/logout');
  }
  return session;
}
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
