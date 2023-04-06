import Logo from "./logo";
import css from "../Assets/css/Header.module.css"
import { useNavigate } from "react-router-dom";
export default function Header(props){
    const navigation = useNavigate();
    function gotoaccount(){
        navigation(`/u/${props.username}`)
    }
    return(
        <>
        <div className={css.header}>
            <Logo/>
            <div className={css.userInfo} onClick={()=> {gotoaccount()}}>
                <img src={props.displayImage} className={css.displayImage}/>
                <p className={css.username}>{props.username}</p>
            </div>
        </div>
        </>
    );
}