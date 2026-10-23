import {signInWithEmailAndPassword, getAuth} from 'firebase/auth'
import { firebaseAuth } from '../firebase'
export const loginRequest =  (email, password) => {
    const auth = firebaseAuth;
    signInWithEmailAndPassword(auth,email,password).then((user) =>{console.log(user)})
}

