import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const res = await fetch(process.env.API_URL + '/api/auth/login' || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();
        const user = data.data.user;

        // If no user is returned or login failed, throw an error
        if (!res.ok || !user) {
          throw new Error("Invalid email or password");
        }

        return {
          id: data.data.token,
          ...user
        };
      },
    }),
  ],
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return {
        ...session,
        token: token.sub
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,  
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(options);

