import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';

const handler = async (req: Request, res: any) => {
  const cookieStore = await cookies();
  const rememberMeCookie = cookieStore.get('rememberMe')?.value;
  
  // Default to 30 days if cookie is not present (fallback/backwards compatibility)
  // If explicitly 'false', set to 1 day.
  const maxAge = rememberMeCookie === 'false' 
    ? 24 * 60 * 60 
    : 30 * 24 * 60 * 60;

  return NextAuth({
    ...authOptions,
    session: {
      ...authOptions.session,
      maxAge,
    }
  })(req, res);
};

export { handler as GET, handler as POST };
