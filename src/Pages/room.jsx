import { useRef, useState } from 'react';
import css from '../Assets/css/roomScreen.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import displayImage from "../Assets/images/Images/default_dp.jpg";
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useUserAuth } from '../Context/AuthContext';
import Popup from '../Components/Popup';
import Singlespeaker from '../Components/Singlespeaker';
import Multispeaker from '../Components/Multispeaker';
import Infosidepanel from '../Components/Infosidepanel';
export default function Room(){
    // Setting variables
    let pc;
    let localstream;
    let remotestream;
    let localvid = useRef();
    let remotevid = useRef();
    let params = useParams();
    const navigation = useNavigate();
    const { user } = useUserAuth();
    const [errorcolor, setErrorcolor] = useState(null);
    const [errormsg, setErrormsg] = useState(null);
    const [popupstate, setPopupstate] = useState(false);
    const [speaker, setSpeaker] = useState(<Singlespeaker name={user.displayName} profileimg={user.photoURL}/>);
    let roomid = params.roomID;
    let servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302']
            }
        ]
    }

    // start function runs on page load checks if room exists then checks if offer exist
    let start = async () => {
        const roomRef = doc(db, "rooms", roomid);
        const roomState = await getDoc(roomRef);
        if (roomState.exists()) {
            let data = roomState.data();
            if (!data.pushedOffer) {
                creatingOffer(roomRef, data)
            }else if (!data.pushedAnswer) {
                creatingAnswer(data);
            }
        }else{
            navigation(`/`);
        }
    }

    // Creating offer function
    let creatingOffer = async (roomRef, data) => {
        localstream = await navigator.mediaDevices.getUserMedia({audio: true})
        localvid.current.srcObject = localstream;
        pc = new RTCPeerConnection();
        remotestream = new MediaStream()
        remotevid.current.srcObject = remotestream
        localstream.getTracks().forEach((track) => {
            pc.addTrack(track, localstream)
        });
        pc.ontrack = async (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remotestream.addTrack(track)
            })
        }
        pc.onicecandidate = async (event) => {
            if(event.candidate){
                let fieldata = JSON.stringify(pc.localDescription)
                const pushedOffer = {
                    offer: fieldata,
                    username:  user.displayName,
                    displayImg: user.photoURL,
                }
                await setDoc(doc(db, "rooms", roomid), { pushedOffer }, { merge: true });
                // console.log("creating offer")
            }
        }
        let offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        onSnapshot(roomRef, (querySnapshot) => {
            // console.log("New data")
            // console.log(querySnapshot.data())      
            let answer = querySnapshot.data().pushedAnswer
            if(!answer) return //console.log('please eneter an answer')
            let theanswer = JSON.parse(answer.answer)
            if (!pc.currentRemoteDescription) {
                pc.setRemoteDescription(theanswer)
                setSpeaker(<Multispeaker peerImg={answer.displayImg} peerName={answer.username} profileimg={user.photoURL}/>)
            }
        });
    }

    // Creating answer function
    let creatingAnswer = async (data) => {
        if (data.Host == user.displayName) {
            // Do nothing this prevents creating answer when you are the Host
        }else{
            localstream = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
            localvid.current.srcObject = localstream;
            pc = new RTCPeerConnection();
            remotestream = new MediaStream()
            remotevid.current.srcObject = remotestream
            localstream.getTracks().forEach((track) => {
                pc.addTrack(track, localstream)
            });
            pc.ontrack = async (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remotestream.addTrack(track)
                })
            }
            pc.onicecandidate = async (event) => {
                if(event.candidate){
                    let fielddata = JSON.stringify(pc.localDescription)
                    if (!user) {
                        const pushedAnswer = { 
                            answer: fielddata,
                            username: localStorage.getItem('username'),
                            displayImg: localStorage.getItem('avatar'),
                            logstate: false
                        }
                        await setDoc(doc(db, "rooms", roomid), { pushedAnswer }, { merge: true });
                    }else if(user){
                        const pushedAnswer = { 
                            answer: fielddata,
                            username: user.displayName,
                            displayImg: user.photoURL,
                            logstate: true
                        }
                        await setDoc(doc(db, "rooms", roomid), { pushedAnswer }, { merge: true });
                    }
                    setSpeaker(<Multispeaker peerImg={data.pushedOffer.displayImg} peerName={data.pushedOffer.username} profileimg={user.photoURL}/>)
                }
            }
            let offer = JSON.parse(data.pushedOffer.offer)
            await pc.setRemoteDescription(offer)
            let answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
        }
    }
    // function for popup component
    function popup(color,msg){
        setErrorcolor(color);
        setErrormsg(msg);
        setPopupstate(true);
        setTimeout(()=>{setPopupstate(false)},5000);
    }
    start();
    return(
        <>
        <div className={css.container}><div className={css.content}>
                {speaker} 
                <audio src="" ref={localvid}></audio>
                <audio src="" ref={remotevid}></audio>
                <Popup color={errorcolor} msg={errormsg} state={popupstate}/>
                <Infosidepanel roomid={roomid} />
            </div>
            <div className={css.controls}>
                <div className={css.centercontrols}>
                    <div className={css.iconcontainer}>
                        <div className={css.microphone}/>
                    </div>
                    <div className={css.iconcontainer}>
                        <div className={css.present}/>
                    </div>
                    <div className={css.iconcontainer}>
                        <div className={css.chat}/>
                    </div>
                    <div className={css.iconcontainer} style={{backgroundColor: "#8AB4F8"}}>
                        <div className={css.info}/>
                    </div>
                    <div className={css.leaveroom}>Leave Room</div>
                </div>
            </div>
        </div>
        </>
    );
}