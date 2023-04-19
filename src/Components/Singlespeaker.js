import css from '../Assets/css/roomScreen.module.css';
import displayImage from "../Assets/images/Images/default_dp.jpg";

export default function Singlespeaker(props){
    return(
        <>
        <div className={css.speaker}>
            <div className={css.top}>
                <div className={css.smallmiccont}>
                    <div className={css.smallmic}/>
                </div>
            </div>
            <div className={css.center}>
                <img src={props.profileimg==null ? displayImage : props.profileimg} className={css.userImage}/>
            </div>
            <div className={css.bottom}>
                <p className={css.username}>{props.name}</p>
            </div>
        </div>
        </>
    );   
}