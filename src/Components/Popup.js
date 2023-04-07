import css from "../Assets/css/popup.module.css";

export default function Popup(params){
    const color = params.color
    const msg= params.msg
    const state= params.state
    return(
        <>
        <div className={state ? css.errordiv : css.errorDivhidden}>
            <div className={color == "red" ? css.Error : css.Notification}/>
            <p className={css.popuptxt}>{msg}</p>
        </div>
        </>
    );
}