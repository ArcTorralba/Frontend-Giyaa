import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: number;
    carerId: number | null | undefined;
    professionalId: number | null | undefined;
    role: 'carer' | 'admin' | 'professional';
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    token: string;
  }
}
declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      carerId: number | null | undefined;
      professionalId: number | null | undefined;
      role: 'carer' | 'admin' | 'professional';
      email: string;
      first_name: string;
      last_name: string;
      is_staff: boolean;
      token: string;
    } & DefaultSession['user'];
  }
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: number;
    role: 'carer' | 'admin' | 'professional';
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    token: string;
  }
}
