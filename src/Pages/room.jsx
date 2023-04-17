import { useRef, useState } from 'react';
import css from '../Assets/css/roomScreen.module.css'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import displayImage from "../Assets/images/Images/default_dp.jpg";
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useUserAuth } from '../Context/AuthContext';
import Popup from '../Components/Popup';
export default function Room(){
    let pc;
    let localstream;
    let remotestream;
    let localvid = useRef();
    let remotevid = useRef();
    let params = useParams();
    const { user } = useUserAuth();
    const [errorcolor, setErrorcolor] = useState(null);
    const [errormsg, setErrormsg] = useState(null);
    const [popupstate, setPopupstate] = useState(false);
    const [speaker, setSpeaker] = useState(
        <div className={css.speaker}>
               <div className={css.top}>
                   <div className={css.smallmiccont}>
                       <div className={css.smallmic}/>
                   </div>
               </div>
               <div className={css.center}>
                   <audio src="" ref={localvid}></audio>
                   <audio src="" ref={remotevid}></audio>
                   <img src={user.photoURL==null ? displayImage : user.photoURL} className={css.userImage}/>
               </div>
               <div className={css.bottom}>
                   <p className={css.username}>{user.displayName}</p>
               </div>
           </div>
   );
    let roomid = params.roomID;
    let servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302']
            }
        ]
    }
    let start = async () => {
        const roomRef = doc(db, "rooms", roomid);
        const roomState = await getDoc(roomRef);
        if (roomState.exists()) {
            let data = roomState.data();
            if (!data.pushedOffer) {
                let creatingOffer = async () => {
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
                            console.log("Offer created")
                        }
                    }
                    let offer = await pc.createOffer()
                    await pc.setLocalDescription(offer)
                    // let fieldata = JSON.stringify(offer)

                    onSnapshot(roomRef, (querySnapshot) => {
                        console.log("New data")
                        console.log(querySnapshot.data())      
                        let answer = querySnapshot.data().pushedAnswer
                        if(!answer) return console.log('please eneter an answer')
                        answer = JSON.parse(answer.answer)
                        if (!pc.currentRemoteDescription) {
                            
                            pc.setRemoteDescription(answer)
                            setSpeaker(
                                <div className={css.speaker}>
                                <div className={css.top}>
                                    <div className={css.smallmiccont}>
                                        <div className={css.smallmic}/>
                                    </div>
                                </div>
                                <div className={css.center}>
                                    <audio src="" ref={localvid}></audio>
                                    <audio src="" ref={remotevid}></audio>
                                    <img src={user.photoURL==null ? displayImage : user.photoURL} className={css.userImage}/>
                                </div>
                                <div className={css.bottom}>
                                    <p className={css.username}>{user.displayName}</p>
                                    <div className={css.smallspeaker}>
                                        <img src={!user.photoURL ? displayImage : user.photoURL} className={css.smalluserImg}/>
                                        <p className={css.you}>You</p>
                                    </div>
                                </div>
                            </div>
                            )
                        }
                    });
                }
                creatingOffer()
            }else{
                let creatingAnswer = async () => {
                    console.log(data)
                if (!data.pushedAnswer) {
                    if (data.Host == user.displayName) {
                        console.log("you cant join your own room twice")
                    }else{
                        console.log(user.displayName)
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
                                // alert("Answer created")
                            }
                        }
                        
                        // setSpeaker(
                        //     <div className={css.speaker}>
                        //     <div className={css.top}>
                        //         <div className={css.smallmiccont}>
                        //             <div className={css.smallmic}/>
                        //         </div>
                        //     </div>
                        //     <div className={css.center}>
                        //         <audio src="" ref={localvid}></audio>
                        //         <audio src="" ref={remotevid}></audio>
                        //         <img src={data.pushedOffer.displayImg == null ? displayImage : data.pushedOffer.displayImg} className={css.userImage}/>
                        //     </div>
                        //     <div className={css.bottom}>
                        //         <p className={css.username}>{data.pushedOffer.username}</p>
                        //         <div className={css.smallspeaker}>
                        //             <img src={!user.photoURL ? displayImage : user.photoURL} className={css.smalluserImg}/>
                        //             <p className={css.you}>You</p>
                        //         </div>
                        //     </div>
                        // </div>
                        // )
                        let offer = JSON.parse(data.pushedOffer.offer)
                        await pc.setRemoteDescription(offer)
                        let answer = await pc.createAnswer()
                        await pc.setLocalDescription(answer)
                        // let fielddata = JSON.stringify(answer)
                    }
                }else{
                    console.log("answer already exists")
                }
                }
                creatingAnswer();
            }
        }else{
            alert("please double check the room id")
        }
    }
    function copyid(){
        navigator.clipboard.writeText(roomid);
        popup("blue", "RoomID Copied")
    }
    function popup(color,msg){
        setErrorcolor(color);
        setErrormsg(msg);
        setPopupstate(true);
        setTimeout(()=>{setPopupstate(false)},5000);
    }
    // const speakerstate = async () => {
    //     const roomRef = doc(db, "rooms", roomid);
    //     const roomState = await getDoc(roomRef);
    //     let data = roomState.data();
    //     if(!data.pushedAnswer){
    //         setSpeaker(
    //              <div className={css.speaker}>
    //                     <div className={css.top}>
    //                         <div className={css.smallmiccont}>
    //                             <div className={css.smallmic}/>
    //                         </div>
    //                     </div>
    //                     <div className={css.center}>
    //                         <audio src="" ref={localvid}></audio>
    //                         <audio src="" ref={remotevid}></audio>
    //                         <img src={user.photoURL==null ? displayImage : user.photoURL} className={css.userImage}/>
    //                     </div>
    //                     <div className={css.bottom}>
    //                         <p className={css.username}>{user.displayName}</p>
    //                     </div>
    //                 </div>
    //         )
    //     }else{
    //     setSpeaker(
    //         <div className={css.speaker}>
    //         <div className={css.top}>
    //             <div className={css.smallmiccont}>
    //                 <div className={css.smallmic}/>
    //             </div>
    //         </div>
    //         <div className={css.center}>
    //             <audio src="" ref={localvid}></audio>
    //             <audio src="" ref={remotevid}></audio>
    //             <img src={user.photoURL==null ? displayImage : user.photoURL} className={css.userImage}/>
    //         </div>
    //         <div className={css.bottom}>
    //             <p className={css.username}>{user.displayName}</p>
    //             <div className={css.smallspeaker}>
    //                 <img src={!user.photoURL ? displayImage : user.photoURL} className={css.smalluserImg}/>
    //                 <p className={css.you}>You</p>
    //             </div>
    //         </div>
    //     </div>
    //     )
    //     }
    // }
    // speakerstate();
    start();
    return(
        <>
        <div className={css.container}><div className={css.content}>
                {speaker} 
                <Popup color={errorcolor} msg={errormsg} state={popupstate}/>
                <div className={css.sidepanel}>
                    <p className={css.title}>Room Details</p>
                    <br />
                    <p className={css.description}>Share Room-Id with other's you want to join</p>
                    <div className={css.roomdiv}>
                        <p>{roomid}</p>
                        <div className={css.copyicon} onClick={()=>{copyid()}}/>
                    </div>
                </div>
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
                    <div className={css.iconcontainer}>
                        <div className={css.info}/>
                    </div>
                    <div className={css.leaveroom}>Leave Room</div>
                </div>
            </div>
        </div>
        </>
    );
}