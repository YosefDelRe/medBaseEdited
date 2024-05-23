import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCleZbzLkiyKW_XLtUrnyVkUA2kb8h_mZg",
    authDomain: "medbase-7c8fc.firebaseapp.com",
    projectId: "medbase-7c8fc",
    storageBucket: "medbase-7c8fc.appspot.com",
    messagingSenderId: "173711901790",
    appId: "1:173711901790:web:2cc4b315f66b7d2efee0cf",
    measurementId: "G-YMYPQ8G0KP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = firebase.firestore();
const auth = firebase.auth();
const EmailAuthProvider = firebase.auth.EmailAuthProvider;

export { db, auth, EmailAuthProvider }; 
