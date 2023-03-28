import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";
import { db } from "../firebase";

export default function Index(){
    const [firstname, setFirstname] = useState("");
    const [secondname, setSecondname] = useState("");
    const [username, setUsername] = useState("");
    const [emailSignup, setEmailSignup] = useState("");
    const [passwordSignup, setPasswordSignup] = useState("");
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const { signUp } = useUserAuth();
    const { logIn } = useUserAuth();
    const navigation = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (firstname != "" && secondname != "" && username != "" && emailSignup != "" && passwordSignup != "") {
            try{
                const usersnameRef = doc(db, "users", username);
                const usernameState = await getDoc(usersnameRef);
                if (usernameState.exists()) {
                    alert("Username is taken")
                } else {
                    await signUp(emailSignup, passwordSignup);
                    await setDoc(doc(db, "users", username), {
                        firstname: firstname,
                        secondname: secondname,
                        email: emailSignup
                    });
                    navigation("/home")
                }
            } 
            catch(error) {
                alert(error.message);
            }
        } else{
            alert("PLease fill all inputs");
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
        <input type="text" placeholder="FirstName" onChange={(e) => setFirstname(e.target.value)}/><br/><br/>
        <input type="text" placeholder="SecondName" onChange={(e) => setSecondname(e.target.value)}/><br/><br/>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
        <input type="text" placeholder="Email" onChange={(e) => setEmailSignup(e.target.value)}/><br/><br/>
        <input type="text" placeholder="Password" onChange={(e) => setPasswordSignup(e.target.value)}/><br/><br/>
        <input type="submit" onClick={handleSignUp}/>
        <br /><br /><br />

        <h3>Log In</h3>
        <input type="text" placeholder="Email" onChange={(e) => setEmailLogin(e.target.value)}/><br/><br/>
        <input type="text" placeholder="Password" onChange={(e) => setPasswordLogin(e.target.value)}/><br/><br/>
        <input type="submit" onClick={handleLogin}/>
        </>
    );
}