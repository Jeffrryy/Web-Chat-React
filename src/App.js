import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA7Jj_Xi6VZCaS0JC9uXL40KdZbF18tsrk",
  authDomain: "nicko-chat-react.firebaseapp.com",
  projectId: "nicko-chat-react",
  storageBucket: "nicko-chat-react.appspot.com",
  messagingSenderId: "882892866181",
  appId: "1:882892866181:web:abbe2d2eb23ac480805fec",
  measurementId: "G-QLS3QXDSJJ"
})
const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);
   
  return (
    <div className="App">
      <header>
      <h1>
        Anjay Bisa tuh
      </h1>
      <SignOut/>
      </header>

     <section>
      {user ? <ChatRoom/> : <SignIn/>}
      </section> 
    </div>
  );
}
function SignIn(){
    const signInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }

  return(
    <button className='sign-in'onClick={signInWithGoogle}>Sign in with google</button>
  )
}

function SignOut() {
   return auth.currentUser && (
    
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
   )
}

function ChatRoom() {
  const dummy =useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const[messages] =useCollectionData(query, {idField : 'id'});

  const [formValue, setFormValue] = useState(''); 

  const sendMessage = async(e) =>{

    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
        text : formValue,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior :'smooth'});
  }
  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} messages={msg} />)}
      <div ref={dummy}>

      </div>
    </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} 
        placeholder='Ketik Disini....'/>

        <button type="submit">kirim pencet ini </button>

      </form>
    </>
  )
}

function ChatMessage(props){
  const {text , uid , photoURL} = props.messages;
  const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/> 
      <p>{text}</p>
    </div>
  )
}
export default App;
