import { useUserAuth } from "../Context/AuthContext";
import LoadingScreen from "./Loading";
import ShortUniqueId from "short-unique-id";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../Components/header";
import displayImage from "../Assets/images/Images/displayImage.jpg";
import css from "../Assets/css/homScreen.module.css"
import { useState } from "react";
import { SyncLoader } from "react-spinners";

export default function Home(){
    const { user } = useUserAuth();
    const navigation = useNavigate();
    const [joining, setJoining] = useState(false);
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
    if(user == null){
        return <LoadingScreen/>
    }
    return(
        <>
        <body>
        <div className={joining ? css.visible : css.hidden}>
            <p className={css.loadingtxt}>Joining</p>
            <SyncLoader color={"#ffffff"}size={5}/>
        </div>
        <Header username={user.displayName} displayImage={displayImage}/>
        <div className={css.mainContent}>
            <p className={css.title}>What's on your mind?</p>
            <p className={css.description}>
                Chat with a friend or create a chat room and invite multiple friends to join, 
                or enter code to join existing room, it's up to you
            </p>
            <div className={css.controlsDiv}>   
                <button className={css.createRoombtn} onClick={()=>{startRoom()}}>
                    <div className={css.addicon}/>
                    Create Room</button>
                <div className={css.formdiv}>
                    <input type="text" placeholder="Enter Room ID to join as guest" className={css.linkinput}/>
                    <button className={css.joinbtn}>
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