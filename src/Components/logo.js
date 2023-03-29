import logo from '../Assets/images/Icons/logoblack.png';
import css from '../Assets/css/logo.module.css'
export default function Logo(){
    return(
        <>
        <div className={css.div}>
            <img src={logo} className={css.logo}/>
            <p className={css.p}>Odify</p>
        </div>
        </>
    );
}