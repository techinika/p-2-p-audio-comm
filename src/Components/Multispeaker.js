import css from '../Assets/css/roomScreen.module.css';
import displayImage from "../Assets/images/Images/default_dp.jpg";

export default function Multispeaker(props){
    return(
        <>
        <div className={css.speaker}>
        <div className={css.top}>
            <div className={css.smallmiccont}>
                <div className={css.smallmic}/>
            </div>
        </div>
        <div className={css.center}>
            <img src={props.peerImg==null ? displayImage : props.peerImg} className={css.userImage}/>
        </div>
        <div className={css.bottom}>
            <p className={css.username}>{props.peerName}</p>
            <div className={css.smallspeaker}>
                <img src={!props.profileimg ? displayImage : props.profileimg} className={css.smalluserImg}/>
                <p className={css.you}>You</p>
            </div>
        </div>
        </div>
        </>
    );
}