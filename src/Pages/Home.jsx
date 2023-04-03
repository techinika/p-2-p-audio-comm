import { useUserAuth } from "../Context/AuthContext";
import LoadingScreen from "./Loading";
import ShortUniqueId from "short-unique-id";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const { user, logOut } = useUserAuth();
    const navigation = useNavigate();
    // const handleLogout = async () => {
    //     try{
    //         await logOut();
    //     }
    //     catch(error){
    //         alert(error.message)
    //     }
    // }
    const startRoom = async () => {
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
        // console.log(`${user.displayName} created chatroom with id ${uuid}`);
        navigation(`/${uuid}`)
    }
    if(user == null){
        return <LoadingScreen/>
    }
    return(
        <>
        <h1>welcome {user.displayName}</h1>
        <button onClick={()=>{startRoom()}}>Start room</button>
        {/* <button onClick={handleLogout}>Logout</button> */}
        </>
    );
}