import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
});
