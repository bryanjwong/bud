import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "https://bud-project-d6a10-default-rtdb.firebaseio.com",
    projectId: "bud-project-d6a10",
    storageBucket: "bud-project-d6a10.appspot.com",
    messagingSenderId: "1020962827599",
    appId: "1:1020962827599:web:13853a36b2e53812c1693a"
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.database()