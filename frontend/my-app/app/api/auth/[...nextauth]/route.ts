// frontend/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login', // Redirects here if there is an error
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_dev_secret_key_123",
});

export { handler as GET, handler as POST };