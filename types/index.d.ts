declare module "#app" {
  import type { Auth } from "@firebase/auth";
  import type { Firestore } from "@firebase/firestore";

  interface NuxtApp {
    $firebaseAuth: Auth;
    $firebaseDb: Firestore;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      image?: string;
      email: string;
      name?: string;
    };
  }
}

declare module "vue3-markdown-it";

export {};
