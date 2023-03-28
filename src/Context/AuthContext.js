import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();
export function AuthContextProvider({ children }){
    const[user, setUser] = useState("");
    function signUp(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            listen();
        }
    },[]);
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