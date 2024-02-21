import { cert } from "firebase-admin/app";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fireorm from "fireorm";
import serviceAccount from "../chat-gpt-russian-firebase.json";

export default defineNuxtPlugin(() => {
  const apps = getApps();
  const app = apps.length
    ? apps[0]
    : initializeApp({
        // @ts-ignore
        credential: cert(serviceAccount),
        databaseURL: "https://chat-gpt-russian-default-rtdb.firebaseio.com",
      });

  fireorm.initialize(getFirestore(app), { validateModels: true });
});
