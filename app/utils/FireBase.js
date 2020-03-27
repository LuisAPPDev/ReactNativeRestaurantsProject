import firebase from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyACPffS9P4nFcMz5mLKJya6qaY6pyg35eM",
    authDomain: "top-tenedores.firebaseapp.com",
    databaseURL: "https://top-tenedores.firebaseio.com",
    projectId: "top-tenedores",
    storageBucket: "top-tenedores.appspot.com",
    messagingSenderId: "810325809372",
    appId: "1:810325809372:web:aef08163a447c01154fc19",
    measurementId: "G-G5LTGLJTYD"
};
  
export const firebaseApp = firebase.initializeApp(firebaseConfig)