import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../Context/AuthContext";
import css from "../Assets/css/Account.module.css";
import displayImage from "../Assets/images/Images/default_dp.jpg";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ShortUniqueId from "short-unique-id";
import { updateProfile } from "firebase/auth";

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
    function displayImgchange(){
        let image = document.getElementById("displayImg");
        let file = document.getElementById("inputfile");
        image.src = URL.createObjectURL(file.files[0])
    }
    function uploadimg(){
        let file = document.getElementById("inputfile");
        const shortUUID = new ShortUniqueId({ length: 10 });
        const displayImgRef = ref(storage, `Profielpics/${shortUUID()}`);
        uploadBytes(displayImgRef, file.files[0]).then((snapshot) => {
            return getDownloadURL(snapshot.ref)
        }).then(downloadURL => {
            // console.log('Download URL', downloadURL)
              updateProfile(user, {
                photoURL: downloadURL
              }).then(
                alert("Profile pic succesffully changed")
              )
        });
    }
    // const params = useParams();
    // let username = params.username
    return(
        <>
        <img src={user.photoURL==null ? displayImage : user.photoURL} className={css.displayImage} id="displayImg"/>
        <h1>{user.displayName}</h1>
        <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={()=>{displayImgchange()}} id="inputfile"/>
        <button onClick={()=>{uploadimg()}}>Upload image</button>
        <br /><br />
        <br /><br />
        <br /><br />
        <br /><br />
        <button onClick={handleLogout}>Logout</button>
        </>
    );
}