import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import css from '../Assets/css/loggedoutScreen.module.css';
import Logo from "../Components/logo";

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
                    await signUp(emailSignup, passwordSignup, username);
                    await setDoc(doc(db, "users", username), {
                        firstname: firstname,
                        secondname: secondname,
                        email: emailSignup
                    });
                    navigation("/")
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
            navigation("/")
        } 
        catch(error) {
            alert(error.message);
        }
    }
    return(
        <>
        {/* <h3>Sign Up</h3>
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
        <input type="submit" onClick={handleLogin}/> */}
        <div className={css.container}>
            <div className={css.header}>
                <Logo/>
                <div className={css.buttons}>
                    <button className={css.lightbluebtn}>Sign up</button>
                    <button className={css.bluebtn}>Log In</button>
                </div>
            </div>
            <div className={css.content}>
                <div className={css.left}>
                    <p className={css.ctamobile}>Chat with friends over voice</p>
                    <p className={css.cta}>Chat with friends <br /> over voice</p><br />
                    <p className={css.txt}>Create or join a chat room and stay for as long as you like, 
                        not only that you also have the ability to share you screen 
                        for even more fun.
                    </p><br />
                    <div className={css.controlsDiv}>   
                        <button className={css.createaccBtn}>Create account</button>
                        <div className={css.formdiv}>
                            <input type="text" placeholder="Enter Room ID to join as guest" className={css.linkinput}/>
                            <button className={css.joinbtn}>
                                <div className={css.joinicon}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={css.right}>
                    <div className={css.top}>
                        <div className={css.topuser}/>
                    </div>
                    <div className={css.center}>
                        <div className={css.leftuser}/>
                        <div className={css.ringone}>
                            <div className={css.ringtwo}>
                                <div className={css.centeruser}/>
                            </div>
                        </div>
                        <div className={css.rightuser}/>
                    </div>
                    <div className={css.bottom}>
                        <div className={css.bottomuser}/>
                    </div>
                </div>
                <div className={css.rightmobile}>
                        <div className={css.topuser}/>
                        <div className={css.leftuser}/>
                        <div className={css.centeruser}/>
                        <div className={css.rightuser}/>
                        <div className={css.bottomuser}/>
                </div>
            </div>
            <div className={css.footer}>
                <p className={css.footertxt}>2023 © Carl-labs</p>
            </div>
        </div>
        </>
    );
}