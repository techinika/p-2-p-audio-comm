import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();
export function AuthContextProvider({ children }){
    const[user, setUser] = useState("");
    // Signup function
    function signUp(email, password, username){
        return createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            const currentUser = auth.currentUser;
              updateProfile(currentUser, {
                displayName: username
              })
        })
    }
    // Login function
    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }
    // Set user 
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            listen();
        }
    },[]);
    // Logout 
    function logOut(){
        return signOut(auth);
    }
    return(
        <AuthContext.Provider value={{user, signUp, logIn, logOut}}>
            { children }
        </AuthContext.Provider>
    );
}
export function useUserAuth(){
    return useContext(AuthContext);
}