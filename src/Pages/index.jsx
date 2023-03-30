import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";
import { db } from "../firebase";
import css from '../Assets/css/loggedoutScreen.module.css';
import Logo from "../Components/logo";
import BeatLoader from "react-spinners/BeatLoader";

export default function Index(){
    const [firstname, setFirstname] = useState("");
    const [secondname, setSecondname] = useState("");
    const [username, setUsername] = useState("");
    const [emailSignup, setEmailSignup] = useState("");
    const [passwordSignup, setPasswordSignup] = useState("");
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [popupState, setpopupState] = useState(css.hiddenPopup);
    const [loginState, setLogin] = useState(css.hiddenLogin);
    const [signupState, setSignup] = useState(css.hiddenSignup);
    const [showsignup, setShowsignup] = useState('Show');
    const [signupPasswordtype, setsignupPasswordtype] = useState('password');
    const [showlogin, setShowlogin] = useState('Show');
    const [loginPasswordtype, setloginPasswordtype] = useState('password');
    const [errormsg, setErrormsg] = useState('Something went wrong try again');
    const [errorDiv, setErrordiv] = useState(css.errorDivhidden);
    const [signupbtnTxt, setSignupbtnTxt] = useState('Sign up');
    const [loginbtnTxt, setLoginbtnTxt] = useState('Log in');
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
                    setErrordiv(css.errorDiv);
                    setErrormsg('Username is taken')
                    setTimeout(()=>{setErrordiv(css.errorDivhidden)},5000);
                } else {
                    setSignupbtnTxt(<BeatLoader color={"#ffffff"}size={7}/>);
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
                setSignupbtnTxt('Sign up');
                setErrordiv(css.errorDiv);
                setTimeout(()=>{setErrordiv(css.errorDivhidden)},5000);
                if (error.message == "Firebase: Error (auth/invalid-email).") {  
                    setErrormsg('Provide a valid email');
                } else if(error.message == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                    setErrormsg('Password should be at least 6 characters');
                } else if(error.message == "Firebase: Error (auth/email-already-in-use)."){
                    setErrormsg('Email is already in use');
                }else{
                    setErrormsg(error.message);
                }
            }
        } else{
            setErrordiv(css.errorDiv);
            setErrormsg('Fill in all fields')
            setTimeout(()=>{setErrordiv(css.errorDivhidden)},5000);
        }
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if (emailLogin != "" && passwordLogin != "") {
            try{
                setLoginbtnTxt(<BeatLoader color={"#ffffff"}size={7}/>);
                await logIn(emailLogin, passwordLogin);
                navigation("/")
            } 
            catch(error) {  
                setLoginbtnTxt('Log in');
                setErrordiv(css.errorDiv);
                setTimeout(()=>{setErrordiv(css.errorDivhidden)},5000);
                if (error.message == "Firebase: Error (auth/invalid-email).") {  
                    setErrormsg('Provide a valid email');
                } else if(error.message == "Firebase: Error (auth/user-not-found)."){
                    setErrormsg('User not found');
                } else if(error.message == "Firebase: Error (auth/wrong-password)."){
                    setErrormsg('Wrong password');
                }else{
                    setErrormsg(error.message);
                }
            }
        }else{ 
            setErrordiv(css.errorDiv);
            setTimeout(()=>{setErrordiv(css.errorDivhidden)},5000); 
            setErrormsg('Fill in all fields');
        }
    }
    function closePopup(){
        setpopupState(css.hiddenPopup);
        setLogin(css.hiddenLogin);
        setSignup(css.hiddenSignup);
    }
    function showSignup(){
        setpopupState(css.popups);
        setSignup(css.signupDiv)
    }
    function showLogin(){
        setpopupState(css.popups);
        setLogin(css.loginDiv)
    }
    function gotologin(){
        setSignup(css.hiddenSignup);
        setLogin(css.loginDiv)
    }
    function gotosignup(){
        setSignup(css.signupDiv);
        setLogin(css.hiddenLogin);
    }
    function showsignupPassword(){
        showsignup == 'Show' ? setShowsignup('Hide') : setShowsignup('Show');
        signupPasswordtype == 'password' ? setsignupPasswordtype('text') : setsignupPasswordtype('password')
    }
    function showloginPassword(){
        showlogin == 'Show' ? setShowlogin('Hide') : setShowlogin('Show');
        loginPasswordtype == 'password' ? setloginPasswordtype('text') : setloginPasswordtype('password')
    }
    return(
        <>
        {/* Popups */}
        <div className={popupState}>  
            <div className={errorDiv}>
                <p>{errormsg}</p>
            </div>
            {/* Signup form */}
            <div className={signupState}>
                <div className={css.fromHeader}>
                    <p className={css.formTitle}>Join us Today 😎</p>
                    <div className={css.closeIcon} onClick={()=>{closePopup()}}/>
                </div>
                <input type="text" className={css.formInputs} placeholder="First name" onChange={(e) => setFirstname(e.target.value)}/><br/><br/>
                <input type="text" className={css.formInputs} placeholder="Second name" onChange={(e) => setSecondname(e.target.value)}/><br/><br/>
                <input type="text" className={css.formInputs} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/><br/><br/>
                <input type="email" className={css.formInputs} placeholder="Email" onChange={(e) => setEmailSignup(e.target.value)}/><br/><br/>
                <div className={css.passwordDiv}>
                    <input type={signupPasswordtype} className={css.passwordInput} placeholder="Password" onChange={(e) => setPasswordSignup(e.target.value)}/>
                    <p className={css.show} onClick={()=>{showsignupPassword()}}>{showsignup}</p>
                </div><br/><br/>
                <button className={css.formBtns} onClick={handleSignUp} >{signupbtnTxt}</button>
                <div className={css.bottomInfo}>
                    <p className={css.bottomTxt}>Already have an account? <span className={css.bluetxt} onClick={()=>{gotologin()}}>Log In</span></p>
                </div>
            </div>
            {/* Login form */}
            <div className={loginState}>
                <div className={css.fromHeader}>
                    <p className={css.formTitle}>Welcome back</p>
                    <div className={css.closeIcon} onClick={()=>{closePopup()}}/>
                </div>
                <input type="email" className={css.formInputs} placeholder="Email" onChange={(e) => setEmailLogin(e.target.value)}/><br/><br/>
                <div className={css.passwordDiv}>
                    <input type={loginPasswordtype} className={css.passwordInput} placeholder="Password" onChange={(e) => setPasswordLogin(e.target.value)}/><br/><br/>
                    <p className={css.show} onClick={()=>{showloginPassword()}}>{showlogin}</p>
                </div><br/><br/>
                <button className={css.formBtns} onClick={handleLogin}>{loginbtnTxt}</button>
                <div className={css.bottomInfo}>
                    <p className={css.bottomTxt}>Dont have an account? <span className={css.bluetxt} onClick={()=>{gotosignup()}}>Sign up</span></p>
                </div> 
            </div>
        </div>

        {/* Main content */}
        <div className={css.container}>
            <div className={css.header}>
                <Logo/>
                <div className={css.buttons}>
                    <button className={css.lightbluebtn} onClick={()=>{showSignup()}}>Sign up</button>
                    <button className={css.bluebtn} onClick={()=>{showLogin()}}>Log In</button>
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
                        <button className={css.createaccBtn} onClick={()=>{showSignup()}}>Create account</button>
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