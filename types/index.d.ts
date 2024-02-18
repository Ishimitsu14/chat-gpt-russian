declare module "#app" {
  import type { Auth } from "@firebase/auth";
  import type { Firestore } from "@firebase/firestore";

  interface NuxtApp {
    $firebaseAuth: Auth;
    $firebaseDb: Firestore;
  }
}

export {};
