import { useUserAuth } from "../Context/AuthContext";

export default function Home(){
    const { user, logOut } = useUserAuth();
    console.log(user)
    const handleLogout = async () => {
        try{
            await logOut();
        }
        catch(error){
            alert(error.message)
        }
    }
    return(
        <>  
        <h1>Welcome {user.email}</h1>
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}