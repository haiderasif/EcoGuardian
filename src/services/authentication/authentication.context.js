import { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  signInWithEmailAndPassword,
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import useLocation from "../location.service";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(true);

  const onLogin = (email, password) => {
    setIsLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((u) => {
        setError(false);
        if (u.user.emailVerified) {
          setIsLoading(false);
          setIsAuthenticated(true);
        } else {
          setIsLoading(false);
          setVerified(false);
        }
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  };
  const forgetPassord = (email) => {
    setError(false);
    setIsLoading(true);
    const auth = getAuth();
    sendPasswordResetEmail(auth, email, null)
      .then(() => {
        alert("reset email sent to " + email);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(true);
        setIsLoading(false);
      });
  };
  const onRegister = (email, password, name, images) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((u) => {
        updateProfile(u.user, {
          displayName: name,
          photoURL: images,
        });
        sendEmailVerification(u.user)
          .then(() => {
            console.log("email sent");
          })
          .catch((e) => {
            console.log(e);
          });
        const db = getDatabase();
        const reference = ref(db, "User/");
        push(reference, {
          Name: name,
          Email: email,
          Picture: images,
          UserId: u.user.uid,
          TreesPlanted: 0,
        });
        setIsLoading(false);
        signOut(auth);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
      });
  };
  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        isauthenticated,
        onLogin,
        onRegister,
        forgetPassord,
        location,
        setIsAuthenticated,
        error,
        setError,
        verified,
        setVerified,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
