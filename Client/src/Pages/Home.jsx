import ShortUniqueId from "short-unique-id";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigation = useNavigate();
    const startRoom = async () => {
        const shortUUID = new ShortUniqueId({ length: 16 });
        function addHyphen(str) {
            const regex = /(.{4})/g;
            const result = str.replace(regex, "$1-");
            return result.replace(/-$/, "");
        }
        const uuid = addHyphen(shortUUID());
        navigation(`/room/${uuid}`)
    }
    return(
        <>
        <h1>Home page</h1>
        <button onClick={startRoom}>Create room</button>
        </>
    );
}