import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getRepository } from "fireorm";
import { User } from "~/server/models/user.model";

const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: "test-123",
  useSecureCookies: false,
  providers: [
    //  @ts-expect-error
    GithubProvider.default({
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
    }),
    //  @ts-expect-error
    GoogleProvider.default({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      idToken: true,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      const redirectUrl = url.startsWith("/")
        ? new URL(url, baseUrl).toString()
        : url;
      console.log(
        `[next-auth] Redirecting to "${redirectUrl}" (resolved from url "${url}" and baseUrl "${baseUrl}")`,
      );
      return redirectUrl;
    },
    async signIn({ user, account }) {
      const userRepository = getRepository(User);
      try {
        await userRepository.create({
          id: user.id as string,
          externalId: user.id as string,
          name: user.name as string,
          email: user.email as string,
          avatar_url: user.image as string,
          provider: account?.provider as string,
        });
      } catch (e: any) {
        console.log(e);
      }
      return true;
    },
  },
});
