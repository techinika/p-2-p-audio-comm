import { useState } from 'react';
import css from '../Assets/css/roomScreen.module.css';
import Popup from './Popup';
export default function Infosidepanel(props){
    const [errorcolor, setErrorcolor] = useState(null);
    const [errormsg, setErrormsg] = useState(null);
    const [popupstate, setPopupstate] = useState(false);
    function copyid(){
        navigator.clipboard.writeText(props.roomid);
        popup("blue", "RoomID Copied")
    }
    function popup(color,msg){
        setErrorcolor(color);
        setErrormsg(msg);
        setPopupstate(true);
        setTimeout(()=>{setPopupstate(false)},5000);
    }
    return(
        <>
        <div className={css.sidepanel}>
        <Popup color={errorcolor} msg={errormsg} state={popupstate}/>
            <p className={css.title}>Room Details</p>
            <br />
            <p className={css.description}>Share Room-Id with other's you want to join</p>
            <div className={css.roomdiv}>
                <p>{props.roomid}</p>
                <div className={css.copyicon} onClick={()=>{copyid()}}/>
            </div>
        </div>
        </>
    );
}