import React, {Component} from 'react'
import { render } from 'react-dom'
import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyDkMLrWZtaefCZOpfw2luyvpaTMZ_9XEUY",
    authDomain: "curso-react-5b044.firebaseapp.com",
    databaseURL: "https://curso-react-5b044.firebaseio.com",
    projectId: "curso-react-5b044",
    storageBucket: "",
    messagingSenderId: "802518092197"
});

import App from './componentes/App'


render(<App />,document.getElementById('root'))