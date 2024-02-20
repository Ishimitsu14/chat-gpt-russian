import { cert } from "firebase-admin/app";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./chat-gpt-russian-firebase.json" assert { type: "json" };

const apps = getApps();
const app = apps.length
  ? apps[0]
  : initializeApp({
      // @ts-ignore
      credential: cert(serviceAccount),
      databaseURL: "https://chat-gpt-russian-default-rtdb.firebaseio.com",
    });

export const firebaseDb = getFirestore(app);
