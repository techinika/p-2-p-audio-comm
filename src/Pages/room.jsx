import { useRef } from 'react';
import css from '../Assets/css/test.module.css'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
export default function Room(){
    let pc;
    let localstream;
    let remotestream;
    let localvid = useRef();
    let remotevid = useRef();
    let firstfield = useRef();
    let secondfield = useRef();
    let params = useParams();
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
                    localstream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: false})
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
                            firstfield.current.value = fieldata
                            const pushedOffer = {
                                offer: fieldata
                            }
                            await setDoc(doc(db, "rooms", roomid), { pushedOffer }, { merge: true });
                            alert("Offer created")
                        }
                    }
                    let offer = await pc.createOffer()
                    await pc.setLocalDescription(offer)
                    let fieldata = JSON.stringify(offer)
                    firstfield.current.value = fieldata

                    onSnapshot(roomRef, (querySnapshot) => {
                        alert("New data")
                        console.log(querySnapshot.data())      
                        let answer = querySnapshot.data().pushedAnswer
                        if(!answer) return alert('please eneter an answer')
                        answer = JSON.parse(answer.answer)
                        if (!pc.currentRemoteDescription) {
                            // console.log(answer)
                            pc.setRemoteDescription(answer)
                        }
                    });
                }
                creatingOffer()
            }else{
                let creatingAnswer = async () => {
                    // console.log(data)
                    localstream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: false})
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
                            secondfield.current.value = fielddata
                            const pushedAnswer = { 
                                answer: fielddata
                            }
                            await setDoc(doc(db, "rooms", roomid), { pushedAnswer }, { merge: true });
                            alert("Answer created")
                        }
                    }
            
                    let offer = JSON.parse(data.pushedOffer.offer)
                    await pc.setRemoteDescription(offer)
                    let answer = await pc.createAnswer()
                    await pc.setLocalDescription(answer)
                    let fielddata = JSON.stringify(answer)
                    secondfield.current.value = fielddata
                }
                creatingAnswer();
            }
        }else{
            alert("please double check the room id")
        }
    }
    let addAnswer = async () => {
        let answer = secondfield.current.value
        if(!answer) return alert('please eneter an answer')
        answer = JSON.parse(answer)
        if (!pc.currentRemoteDescription) {
            pc.setRemoteDescription(answer)
        }
    }

    start();
    return(
        <>
        <div className={css.vidcont}>
            <video ref={localvid} autoplay="true" className={css.vids}></video>
            <video ref={remotevid} autoplay="true" className={css.vids}></video>
        </div>
        <div className={css.cont}>
            <textarea ref={firstfield}></textarea>
            <textarea ref={secondfield}></textarea>
            <button onClick={()=> {addAnswer()}}>Add answer</button>
        </div>
        </>
    );
}