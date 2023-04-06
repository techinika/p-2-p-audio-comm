import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";

export default function Account(){
    const { user, logOut } = useUserAuth();
    // const navigation = useNavigate();
    const handleLogout = async () => {
        try{
            await logOut();
        }
        catch(error){
            alert(error.message)
        }
    }
    const params = useParams();
    let username = params.username
    return(
        <>
        <h1>Hello {username}</h1>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}