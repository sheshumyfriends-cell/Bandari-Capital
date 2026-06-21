import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        if (!user.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id || user.sub;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};

export default NextAuth(authOptions as any);
