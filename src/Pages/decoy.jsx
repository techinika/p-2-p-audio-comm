import { useParams } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";

export default function Decoy(){
    const params = useParams();
    const { user } = useUserAuth();
    return(
        <>
            <h1>Hey {user.displayName}</h1>
            <h2>Room ID: {params.roomID}</h2>
        </>
    );
}