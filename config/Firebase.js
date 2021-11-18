import firebase from "firebase";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.API_KEY,
  authDomain: Constants.manifest.extra.AUTH_DOMAIN,
  databaseURL: Constants.manifest.extra.DATABASE_URL,
  projectId: Constants.manifest.extra.PROJECT_ID,
  storageBucket: Constants.manifest.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.manifest.extra.MESSAGE_SENDER_ID,
  appId: Constants.manifest.extra.APP_ID,
  measurementId: Constants.manifest.extra.MEASUREMENT_ID,
};

let Firebase = firebase.initializeApp(firebaseConfig);

export const auth = Firebase.auth();
export const db = Firebase.firestore();
export default Firebase;
