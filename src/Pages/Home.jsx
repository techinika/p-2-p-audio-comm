import { useUserAuth } from "../Context/AuthContext";
import LoadingScreen from "./Loading";

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
    if(user == null){
        return <LoadingScreen/>
    }
    return(
        <>
        <h1>welcome {user.email}</h1>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}