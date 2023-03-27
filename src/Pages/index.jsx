import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";

export default function Index(){
    const [emailSignup, setEmailSignup] = useState("");
    const [passwordSignup, setPasswordSignup] = useState("");
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const { signUp } = useUserAuth();
    const { logIn } = useUserAuth();
    const navigation = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        try{
            await signUp(emailSignup, passwordSignup);
            navigation("/home")
        } 
        catch(error) {
            alert(error.message);
        }
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await logIn(emailLogin, passwordLogin);
            navigation("/home")
        } 
        catch(error) {
            alert(error.message);
        }
    }
    return(
        <>
        <h3>Sign Up</h3>
        <input type="text" placeholder="Email" onChange={(e) => setEmailSignup(e.target.value)}/>
        <input type="text" placeholder="Password" onChange={(e) => setPasswordSignup(e.target.value)}/>
        <input type="submit" onClick={handleSignUp}/>
        <br /><br /><br />

        <h3>Log In</h3>
        <input type="text" placeholder="Email" onChange={(e) => setEmailLogin(e.target.value)}/>
        <input type="text" placeholder="Password" onChange={(e) => setPasswordLogin(e.target.value)}/>
        <input type="submit" onClick={handleLogin}/>
        </>
    );
}