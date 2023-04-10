import { useUserAuth } from "../Context/AuthContext";
import LoadingScreen from "./Loading";
import ShortUniqueId from "short-unique-id";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../Components/header";
import displayImage from "../Assets/images/Images/default_dp.jpg";
import css from "../Assets/css/homScreen.module.css"
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import Popup from "../Components/Popup";

export default function Home(){
    const { user } = useUserAuth();
    const navigation = useNavigate();
    const [joining, setJoining] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [errorcolor, setErrorcolor] = useState(null);
    const [errormsg, setErrormsg] = useState(null);
    const [popupstate, setPopupstate] = useState(false);
    const startRoom = async () => {
        setJoining(true)
        const shortUUID = new ShortUniqueId({ length: 16 });
        function addHyphen(str) {
            const regex = /(.{4})/g;
            const result = str.replace(regex, "$1-");
            return result.replace(/-$/, "");
        }
        const uuid = addHyphen(shortUUID());
        await setDoc(doc(db, "rooms", uuid), { 
            Host: user.displayName
        });
        navigation(`/${uuid}`)
    }
    const joinbyID = async () => {
        if (roomId.split("").length == 19) {
            const roomRef = doc(db, "rooms", roomId);
            const roomState = await getDoc(roomRef);
            if (roomState.exists()) {
                navigation(`/${roomId}`)
            }else{
                popup("red", "Double-check Room ID")
            }
        }else{
            popup("red", "This is an invalid Room ID")
        }
    }
    function popup(color,msg){
        setErrorcolor(color);
        setErrormsg(msg);
        setPopupstate(true);
        setTimeout(()=>{setPopupstate(false)},5000);
    }
    if(user == null){
        return <LoadingScreen/>
    }
    console.log(user)
    return(
        <>
        <body>
        <Popup color={errorcolor} msg={errormsg} state={popupstate}/>
        <div className={joining ? css.visible : css.hidden}>
            <p className={css.loadingtxt}>Joining</p>
            <SyncLoader color={"#ffffff"}size={5}/>
        </div>
        <Header username={user.displayName} displayImage={user.photoURL==null ? displayImage : user.photoURL}/>
        <div className={css.mainContent}>
            <p className={css.title}>What's on your mind?</p>
            <p className={css.description}>
                A small glimpse of what's possible: One on one chatroom, Multi-user chatroom, 
                Screen sharing, Voicenote sharinging in mutli-user chatrooms and much much more on the way 😍
            </p>
            <div className={css.controlsDiv}>   
                <button className={css.createRoombtn} onClick={()=>{startRoom()}}>
                    <div className={css.addicon}/>
                    Create Room</button>
                    <div className={css.formdiv}>
                        <input type="text" 
                            placeholder="Enter Room ID to join as guest" 
                            className={css.linkinput}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button className={css.joinbtn} onClick={()=>{joinbyID()}}>
                        <div className={css.joinicon}/>
                        </button>
                    </div>
            </div>
        </div>
        <div className={css.footer}>
            <p className={css.footertxt}>2023 © Carl-labs</p>
        </div>
        </body>
        </>
    );
}