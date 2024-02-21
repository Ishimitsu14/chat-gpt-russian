import { cert } from "firebase-admin/app";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fireorm from "fireorm";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(config.GOOGLE_CERT_ABSOLUTE_PATH as string);
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
