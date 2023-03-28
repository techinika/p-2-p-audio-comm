import css from '../Assets/css/loadingScreen.module.css';
import logoblack from '../Assets/images/Icons/logoblack.png'
export default function LoadingScreen(){
    return(
        <>
        <div className={css.container}>
            <img src={logoblack} />
        </div>
        </>
    );
}