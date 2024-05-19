import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4YebzK6kC5RAfD886awMAM-XxGTeR1LE",
    authDomain: "tempmedbse.firebaseapp.com",
    projectId: "tempmedbse",
    storageBucket: "tempmedbse.appspot.com",
    messagingSenderId: "660916490327",
    appId: "1:660916490327:web:5443ec1b6f12b187839312",
    measurementId: "G-Q2T7T86NGY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = firebase.firestore();
const auth = firebase.auth();
const EmailAuthProvider = firebase.auth.EmailAuthProvider;

export { db, auth, EmailAuthProvider }; 
