import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyA4vk4XXeNMsd7Q7h321Nawlahmr2CjjBM",
    authDomain: "whatsapp-69ec2.firebaseapp.com",
    projectId: "whatsapp-69ec2",
    storageBucket: "whatsapp-69ec2.appspot.com",
    messagingSenderId: "502270165910",
    appId: "1:502270165910:web:a887faa9cf7aa13c0613b7",
    measurementId: "G-V8YW6QZ1J8"
  };

  const app =  !firebase.apps.length ?   firebase.initializeApp(firebaseConfig) 
  : firebase.app();

  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { db , auth , provider };