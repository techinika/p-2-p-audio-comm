import { useState } from "react";
import css from "../Assets/css/Avatar.module.css"
import Popup from "../Components/Popup";
import { SyncLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

export default function Avatar(){
    // Setting variables 
    let params = useParams();
    const navigation = useNavigate();
    const [emoji, setEmoji] = useState("😎");
    const [theme, setTheme] = useState("#FFE4AF");
    const [name, setName] = useState("");
    const [notification, setNitification] = useState(true);
    const [joining, setJoining] = useState(false);
    const [errorcolor, setErrorcolor] = useState(null);
    const [errormsg, setErrormsg] = useState(null);
    const [popupstate, setPopupstate] = useState(false);
    let roomid = params.roomID;

    // settheTheme state on click 
    function settheTheme(e){
        setTheme(e.target.value)
    }

    // setEmoji state on click 
    function settheEmoji(e){
        setEmoji(e.target.value)
    }

    // Check if there is no name before setting localstorage and navigatinh to room
    function createAvatar(){
        if (name == "") {
            popup("red", "Please enter a name")
        }else{
            setJoining(true);
            const avatar = emoji+theme;
            localStorage.setItem("username", name);
            localStorage.setItem("avatar", avatar);
            navigation(`/${roomid}`)
        }
    }

    // Hode notification when okay is clicked
    function hideNotification(){
        setNitification(false)
    }

    // function for popup component
    function popup(color,msg){
        setErrorcolor(color);
        setErrormsg(msg);
        setPopupstate(true);
        setTimeout(()=>{setPopupstate(false)},5000);
    }
    
    return(
        <>
        {/* Joining overlay */}
        <div className={joining ? css.visible : css.hidden}>
            <p className={css.loadingtxt}>Joining</p>
            <SyncLoader color={"#ffffff"}size={5}/>
        </div>

        {/* Popup component */}
        <Popup color={errorcolor} msg={errormsg} state={popupstate}/>

        {/* Notification on screenload  */}
        <div className={notification ? css.notificontainer : css.hiddennotification}>
            <div className={css.notification}>
                <p className={css.notifTitle}>Create an avatar</p>
                <p className={css.notiftxt}>To create a better experience for other user's please 
                    add your name and create an avatar.
                </p>
                <button className={css.notifBtn} onClick={()=>{hideNotification()}}>OK</button>
            </div>
        </div>

        {/* Body */}
        <div className={css.body}>
            <div className={css.container}>
                <div className={css.top}>
                <div className={css.avatar_theme} style={{ backgroundColor: theme}}>
                    <p className={css.avatar_emoji}>{emoji}</p>
                </div>
                <input type="text" placeholder="Input your name" className={css.form} onChange={(e) => setName(e.target.value)}/>
                </div>
                <br />

                {/* Emoji Options  */}
                <Emoji number="3" emoji="😎"/>
                <Emoji number="5" emoji="😊"/>
                <Emoji number="6" emoji="😍"/>
                <Emoji number="7" emoji="🥰"/>
                <Emoji number="8" emoji="🙂"/>
                <Emoji number="9" emoji="🤗"/>
                <Emoji number="10" emoji="🤩"/>
                <Emoji number="11" emoji="🤔"/>
                <Emoji number="13" emoji="🤨"/>
                <Emoji number="16" emoji="😶"/>
                <Emoji number="18" emoji="😏"/>
                <Emoji number="21" emoji="🥱"/>
                <Emoji number="22" emoji="😴"/>
                <Emoji number="23" emoji="😌"/>
                <Emoji number="24" emoji="😛"/>
                <Emoji number="26" emoji="😒"/>
                <Emoji number="28" emoji="🙃"/>
                <Emoji number="29" emoji="🫠"/>
                <Emoji number="30" emoji="🤑"/>
                <Emoji number="34" emoji="😩"/>
                <Emoji number="35" emoji="🤯"/>
                <Emoji number="36" emoji="😮‍💨"/>
                <Emoji number="39" emoji="🥵"/>
                <Emoji number="40" emoji="🥶"/>
                <Emoji number="42" emoji="🤪"/>
                <Emoji number="44" emoji="😡"/>
                <Emoji number="45" emoji="😷"/>
                <Emoji number="47" emoji="🤕"/>
                <Emoji number="48" emoji="😇"/>
                <Emoji number="49" emoji="🥳"/>
                <Emoji number="50" emoji="🥸"/>
                <Emoji number="51" emoji="🥺"/>
                <Emoji number="53" emoji="🤠"/>
                <Emoji number="54" emoji="🤡"/>
                <Emoji number="56" emoji="🧐"/>
                <Emoji number="57" emoji="🤓"/>
                <Emoji number="58" emoji="👽"/>
                <Emoji number="59" emoji="🤖"/>
                <Emoji number="60" emoji="🐶"/>
                <Emoji number="61" emoji="🦊"/>
                <Emoji number="62" emoji="🐷"/>
                <Emoji number="63" emoji="🐯"/>
                <Emoji number="64" emoji="🦁"/>
                <Emoji number="65" emoji="🐱"/>
                <Emoji number="66" emoji="🐺"/>
                <Emoji number="67" emoji="🐭"/>
                <Emoji number="68" emoji="🐸"/>
                <Emoji number="69" emoji="🐼"/>
                <Emoji number="70" emoji="🐰"/>
                <Emoji number="71" emoji="🐻"/>
                <Emoji number="72" emoji="🐻‍❄️"/>
                <Emoji number="73" emoji="🐨"/>
                <Emoji number="74" emoji="🐔"/>
                <Emoji number="75" emoji="🦄"/>
                <Emoji number="76" emoji="🦥"/>
                <Emoji number="78" emoji="🦢"/>
                <Emoji number="79" emoji="🐧"/>
                <Emoji number="80" emoji="🦩"/>
                <Emoji number="81" emoji="🐣"/>
                <Emoji number="82" emoji="🐞"/>
                <Emoji number="83" emoji="🪲"/>
                <Emoji number="84" emoji="🦉"/>
                <Emoji number="85" emoji="🐳"/>
                <Emoji number="86" emoji="🐬"/>
                <Emoji number="88" emoji="🐾"/>
                <Emoji number="89" emoji="😼"/>
                <Emoji number="90" emoji="😈"/>
                <br /><br /><br />

                {/* Theme options  */}
                <div className={css.themeContainer}>
                    <Theme number="color1" color="#FFE4AF"/>
                    <Theme number="color2" color="#93D7F5"/>
                    <Theme number="color3" color="#AAFAD9"/>
                    <Theme number="color4" color="#D1C4FF"/>
                    <Theme number="color5" color="#FDC1AD"/>
                    <Theme number="color6" color="#FFABC7"/>
                    <Theme number="color7" color="#CED8DE"/>
                    <Theme number="color8" color="#99CAFE"/>
                    <Theme number="color9" color="#95DBD4"/>
                    <Theme number="color10" color="#FAA0AA"/>
                    <Theme number="color11" color="#EAE0D6"/>
                </div>
                <button onClick={createAvatar} className={css.submitbtn}>Continue to room</button>
            </div>
        </div>
        </>
    );
    // components 
    function Emoji(props){
        return(
            <>  
            <input type="radio" name="emoji" id={props.number} onChange={(e)=>{settheEmoji(e)}} value={props.emoji}/>
            <label className={css.selectemoji} htmlFor={props.number}>{props.emoji}</label>
            </>
        )
    }
    function Theme(props){
        return(
            <>
            <input type="radio" name="theme" id={props.number} onChange={(e)=>{settheTheme(e)}} value={props.color}/>
            <label htmlFor={props.number}><div className={css.themebox} style={{ backgroundColor: props.color }}/></label>
            </>
        )
    }
}