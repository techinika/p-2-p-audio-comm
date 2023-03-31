import { useUserAuth } from "../Context/AuthContext";
import LoadingScreen from "./Loading";
import ShortUniqueId from "short-unique-id";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Home(){
    const { user, logOut } = useUserAuth();
    const handleLogout = async () => {
        try{
            await logOut();
        }
        catch(error){
            alert(error.message)
        }
    }
    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ],
        iceCandidatePollSize: 10,
    }
    let peerConn = new RTCPeerConnection(servers);
    const startRoom = async () => {
        // Creating a UUID
        const shortUUID = new ShortUniqueId({ length: 16 });
        function addHyphen(str) {
            const regex = /(.{4})/g;
            const result = str.replace(regex, "$1-");
            return result.replace(/-$/, "");
        }
        const uuid = addHyphen(shortUUID());

        // Creating offer and adding it to the rooms collection
        const offerDescription = await peerConn.createOffer();
        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type
        }
        await setDoc(doc(db, "rooms", uuid), { offer });
        console.log(`Created room with code: ${uuid}`)

        //Getting caller iceCandidates
        peerConn.onicecandidate = event => {
            const availablecand = event.candidate;
            const newCityRef = doc(collection(db, "rooms", uuid));
            const setice = async ()=>{   
                await setDoc(newCityRef, availablecand.toJSON());
            }
            setice();
        }
        await peerConn.setLocalDescription(offerDescription);
    }
    if(user == null){
        return <LoadingScreen/>
    }
    return(
        <>
        <h1>welcome {user.displayName}</h1>
        <button onClick={()=>{startRoom()}}>Start room</button>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}