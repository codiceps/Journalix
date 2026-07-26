import { NextAuthOptions } from 'next-auth';
import _CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

const CredentialsProvider = (_CredentialsProvider as any).default?.default || (_CredentialsProvider as any).default || _CredentialsProvider;

export async function authenticate(credentials: Record<string, string> | undefined) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email dan password wajib diisi');
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error('Email tidak ditemukan');
  }

  const isValidPassword = await bcrypt.compare(credentials.password, user.password);

  if (!isValidPassword) {
    throw new Error('Password salah');
  }

  if (user.status === 'PENDING') {
    throw new Error('Akun Anda masih menunggu persetujuan Admin');
  }

  if (user.status === 'REJECTED') {
    throw new Error('Akun Anda telah ditolak oleh Admin');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: authenticate,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
